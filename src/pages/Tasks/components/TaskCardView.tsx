import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTodos } from "@/store/todo.store";
import type { Todo } from "@/types";
import { getStatusColor, getStatusText } from "@/utils/todoHelpers";
import { Edit, Trash2 } from "lucide-react";

type TaskCardViewType = {
  todo: Todo;
};

const TaskCardView = ({ todo }: TaskCardViewType) => {
  const setCurrentTask = useTodos((s) => s.setCurrentTask);
  const setOpenModal = useTodos((s) => s.setOpenModal);
  const removeTodo = useTodos((s) => s.removeTodo);

  const handleView = () => {
    setCurrentTask(todo);
    setOpenModal("view");
  };

  const handleDelete = () => {
    removeTodo(todo.id);
  };

  const handleUpdate = () => {
    setCurrentTask(todo);
    setOpenModal("edit");
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
      <div className="flex items-center justify-between" onClick={handleView}>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {todo.title}
          </h3>
        </div>
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ml-2 transition-transform group-hover:-translate-x-20",
            getStatusColor(todo.status)
          )}
        >
          {getStatusText(todo.status)}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-2 absolute right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleUpdate();
            }}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCardView;
