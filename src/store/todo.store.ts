import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Todo } from "../types";
import { v4 as uuidv4 } from "uuid";

interface TodoStore {
  // State
  todos: Todo[];
  openModalFor: "view" | "edit" | "new" | null;
  currentTask: Todo | null;
  searchedTodos: Todo[];
  searchTerm: string;
  inputValue: string;

  // Actions
  setOpenModal: (val: TodoStore["openModalFor"]) => void;
  setCurrentTask: (val: TodoStore["currentTask"]) => void;
  setInputValue: (value: string) => void;
  performSearch: (term: string) => void;
  addTodo: (task: string, description?: string) => void;
  removeTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
}

const initialTodos: Todo[] = [
  {
    id: "1",
    title: "Work",
    status: "TODO",
  },
  {
    id: "2",
    title: "Review",
    status: "IN_PROGRESS",
  },
  {
    id: "3",
    title: "Deploy",
    status: "COMPLETED",
  },
];

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

        setInputValue: (inputValue) => set({ inputValue }),

        performSearch: (searchTerm) => {
          const newTodos = get().todos.filter((todo) =>
            todo.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
          set({ searchTerm, searchedTodos: newTodos });
        },

        setOpenModal: (openModalFor) => set({ openModalFor }),
        setCurrentTask: (currentTask) => set({ currentTask }),
        addTodo: (task, description) =>
          set(() => {
            const newTodos = [
              ...get().todos,
              {
                id: uuidv4(),
                title: task,
                description: description || "",
                status: "TODO" as const,
              },
            ];
            return { todos: newTodos };
          }),
        removeTodo: (id) =>
          set(() => {
            const newTodos = get().todos.filter((todo) => todo.id !== id);
            return { todos: newTodos };
          }),
        updateTodo: (id, updates) =>
          set(() => {
            const newTodos = get().todos.map((todo) =>
              todo.id === id ? { ...todo, ...updates } : todo
            );
            return { todos: newTodos };
          }),
      };
    },
    {
      name: "todo-storage",
    }
  )
);
