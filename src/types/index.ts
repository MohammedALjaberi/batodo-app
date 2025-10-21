export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  count?: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  startDate?: string;
  endDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  startDate?: string;
  endDate?: string;
}

export interface GetTasksParams {
  search?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  sortBy?: string;
  order?: "asc" | "desc";
}
