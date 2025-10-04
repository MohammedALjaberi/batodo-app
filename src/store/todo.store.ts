import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Todo } from "../types";
import { v4 as uuidv4 } from "uuid";

interface TodoStore {
  todos: Todo[];
  searchTerm: string;
  addTodo: (task: string, description?: string) => void;
  removeTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  setSearchTerm: (term: string) => void;
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
      const getCurrentTodos = () => get().todos;
      return {
        todos: initialTodos,
        searchTerm: "",
        addTodo: (task, description) =>
          set(() => {
            const newTodos = [
              ...getCurrentTodos(),
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
            const newTodos = getCurrentTodos().filter((todo) => todo.id !== id);
            return { todos: newTodos };
          }),
        updateTodo: (id, updates) =>
          set(() => {
            const newTodos = getCurrentTodos().map((todo) =>
              todo.id === id ? { ...todo, ...updates } : todo
            );
            return { todos: newTodos };
          }),
        setSearchTerm: (term) => set({ searchTerm: term }),
      };
    },
    {
      name: "todo-storage",
    }
  )
);
