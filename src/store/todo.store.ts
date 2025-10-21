import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Todo,
  type CreateTaskRequest,
  type UpdateTaskRequest,
  type GetTasksParams,
} from "../types";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  dateHelpers,
} from "../services/api";

interface TodoStore {
  // State
  todos: Todo[];
  openModalFor: "view" | "edit" | "new" | null;
  currentTask: Todo | null;
  searchedTodos: Todo[];
  searchTerm: string;
  inputValue: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  setOpenModal: (val: TodoStore["openModalFor"]) => void;
  setCurrentTask: (val: TodoStore["currentTask"]) => void;
  setInputValue: (value: string) => void;
  performSearch: (term: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // API Actions
  fetchTodos: (params?: GetTasksParams) => Promise<void>;
  addTodo: (
    task: string,
    description?: string,
    startDate?: Date,
    endDate?: Date
  ) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
}

const initialTodos: Todo[] = [];

export const useTodos = create<TodoStore>()(
  persist<TodoStore>(
    (set, get) => {
      return {
        todos: initialTodos,
        searchedTodos: [],
        searchTerm: "",
        inputValue: "",
        currentTask: null,
        openModalFor: null,
        isLoading: false,
        error: null,

        setInputValue: (inputValue) => set({ inputValue }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),

        performSearch: async (searchTerm) => {
          try {
            set({ isLoading: true, error: null });

            if (!searchTerm.trim()) {
              // If empty search, fetch all tasks
              const { tasks } = await getTasks();
              const parsedTasks = tasks.map(dateHelpers.parseTaskFromApi);
              set({
                searchTerm: "",
                searchedTodos: [],
                todos: parsedTasks,
                isLoading: false,
              });
            } else {
              // Make API call with search parameter
              const { tasks } = await getTasks({
                search: searchTerm,
              });
              const parsedTasks = tasks.map(dateHelpers.parseTaskFromApi);
              set({
                searchTerm,
                searchedTodos: parsedTasks,
                isLoading: false,
              });
            }
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Search failed",
              isLoading: false,
            });
          }
        },

        setOpenModal: (openModalFor) => set({ openModalFor }),
        setCurrentTask: (currentTask) => set({ currentTask }),

        // Fetch todos from API
        fetchTodos: async (params) => {
          try {
            set({ isLoading: true, error: null });
            const { tasks } = await getTasks(params);
            const parsedTasks = tasks.map(dateHelpers.parseTaskFromApi);
            set({ todos: parsedTasks, isLoading: false });
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch tasks",
              isLoading: false,
            });
          }
        },

        // Add todo via API
        addTodo: async (task, description, startDate, endDate) => {
          try {
            set({ isLoading: true, error: null });
            const taskData = dateHelpers.prepareTaskForApi({
              title: task,
              description: description || "",
              status: "TODO" as const,
              startDate,
              endDate,
            }) as CreateTaskRequest;

            const newTask = await createTask(taskData);
            const parsedTask = dateHelpers.parseTaskFromApi(newTask);

            const currentState = get();
            if (currentState.searchTerm) {
              await get().performSearch(currentState.searchTerm);
            } else {
              set((state) => ({
                todos: [...state.todos, parsedTask],
                isLoading: false,
              }));
            }
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to create task",
              isLoading: false,
            });
          }
        },

        // Remove todo via API
        removeTodo: async (id) => {
          try {
            set({ isLoading: true, error: null });
            await deleteTask(id);

            // If we're currently searching, refresh the search results
            const currentState = get();
            if (currentState.searchTerm) {
              await get().performSearch(currentState.searchTerm);
            } else {
              set((state) => ({
                todos: state.todos.filter((todo) => todo.id !== id),
                isLoading: false,
              }));
            }
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to delete task",
              isLoading: false,
            });
          }
        },

        // Update todo via API
        updateTodo: async (id, updates) => {
          try {
            set({ isLoading: true, error: null });
            const updateData = dateHelpers.prepareTaskForApi(
              updates
            ) as UpdateTaskRequest;
            const updatedTask = await updateTask(id, updateData);
            const parsedTask = dateHelpers.parseTaskFromApi(updatedTask);
            const currentState = get();
            if (currentState.searchTerm) {
              await get().performSearch(currentState.searchTerm);
            } else {
              set((state) => ({
                todos: state.todos.map((todo) =>
                  todo.id === id ? parsedTask : todo
                ),
                isLoading: false,
              }));
            }
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to update task",
              isLoading: false,
            });
          }
        },
      };
    },
    {
      name: "todo-storage",
    }
  )
);
