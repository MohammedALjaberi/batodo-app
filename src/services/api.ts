import axios from "axios";
import type {
  Todo,
  ApiResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  GetTasksParams,
} from "../types";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://todo-be-lac.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

//  Create a new task
export const createTask = async (
  taskData: CreateTaskRequest
): Promise<Todo> => {
  const response = await api.post<ApiResponse<Todo>>("/tasks", taskData);
  return response.data.data;
};

// Get all tasks with optional filtering and sorting
export const getTasks = async (
  params?: GetTasksParams
): Promise<{ tasks: Todo[]; count: number }> => {
  const response = await api.get<ApiResponse<Todo[]>>("/tasks", { params });
  return {
    tasks: response.data.data,
    count: response.data.count || response.data.data.length,
  };
};

// Get a single task by ID
export const getTask = async (id: string): Promise<Todo> => {
  const response = await api.get<ApiResponse<Todo>>(`/tasks/${id}`);
  return response.data.data;
};

// Update an existing task
export const updateTask = async (
  id: string,
  updates: UpdateTaskRequest
): Promise<Todo> => {
  const response = await api.put<ApiResponse<Todo>>(`/tasks/${id}`, updates);
  return response.data.data;
};

// Delete a task
export const deleteTask = async (id: string): Promise<Todo> => {
  const response = await api.delete<ApiResponse<Todo>>(`/tasks/${id}`);
  return response.data.data;
};

// Helper functions to convert between Date objects and ISO strings
export const dateHelpers = {
  // Convert Date to ISO string for API requests
  toISOString: (date?: Date): string | undefined => {
    return date ? date.toISOString() : undefined;
  },

  // Convert ISO string to Date object from API responses
  fromISOString: (dateString?: string): Date | undefined => {
    return dateString ? new Date(dateString) : undefined;
  },

  // Transform task data for API request (Date -> ISO string)
  prepareTaskForApi: (
    task: Partial<Todo>
  ): CreateTaskRequest | UpdateTaskRequest => {
    return {
      ...task,
      startDate: dateHelpers.toISOString(task.startDate),
      endDate: dateHelpers.toISOString(task.endDate),
    };
  },

  // Transform task data from API response (ISO string -> Date)
  parseTaskFromApi: (task: any): Todo => {
    return {
      ...task,
      startDate: dateHelpers.fromISOString(task.startDate),
      endDate: dateHelpers.fromISOString(task.endDate),
      createdAt: dateHelpers.fromISOString(task.createdAt),
      updatedAt: dateHelpers.fromISOString(task.updatedAt),
    };
  },
};

// Export default api instance for custom requests if needed
export default api;
