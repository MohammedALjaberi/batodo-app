import type { Todo } from "../types";

const STATUS_CONFIG = {
  TODO: {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    text: "To Do",
  },
  IN_PROGRESS: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    text: "In Progress",
  },
  COMPLETED: {
    color: "bg-green-100 text-green-800 border-green-200",
    text: "Completed",
  },
} as const;

const DEFAULT_STATUS = {
  color: "bg-gray-100 text-gray-800 border-gray-200",
  text: "Unknown",
} as const;

export const getStatusColor = (status: Todo["status"]): string =>
  STATUS_CONFIG[status]?.color ?? DEFAULT_STATUS.color;

export const getStatusText = (status: Todo["status"]): string =>
  STATUS_CONFIG[status]?.text ?? status;
