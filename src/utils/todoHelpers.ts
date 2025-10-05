import type { Todo } from "../types";
import i18n from "../../i18n.config";

const STATUS_CONFIG = {
  TODO: {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    textKey: "status.todo",
  },
  IN_PROGRESS: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    textKey: "status.inProgress",
  },
  COMPLETED: {
    color: "bg-green-100 text-green-800 border-green-200",
    textKey: "status.completed",
  },
} as const;

const DEFAULT_STATUS = {
  color: "bg-gray-100 text-gray-800 border-gray-200",
  textKey: "status.unknown",
} as const;

export const getStatusColor = (status: Todo["status"]): string =>
  STATUS_CONFIG[status]?.color ?? DEFAULT_STATUS.color;

export const getStatusText = (status: Todo["status"]): string => {
  const textKey = STATUS_CONFIG[status]?.textKey ?? DEFAULT_STATUS.textKey;
  return i18n.t(textKey) || status;
};
