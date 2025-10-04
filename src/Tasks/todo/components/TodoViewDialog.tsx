import type { Todo } from "../../../types";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { getStatusColor, getStatusText } from "../../../utils/todoHelpers";

interface TodoViewDialogProps {
  todo: Todo;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TodoViewDialog = ({
  todo,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: TodoViewDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <p className="mt-1 text-sm text-gray-900">{todo.title}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <p className="mt-1 text-sm text-gray-600">
              {todo.description || "No description provided"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <div className="mt-1">
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                  getStatusColor(todo.status)
                )}
              >
                {getStatusText(todo.status)}
              </span>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={onDelete}
              className="text-red-500 hover:text-red-600"
            >
              Delete
            </Button>
            <Button variant="outline" onClick={onEdit}>
              Edit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TodoViewDialog;
