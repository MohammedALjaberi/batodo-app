import { useState, useEffect } from "react";
import type { Todo } from "../../../types";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Textarea } from "../../../components/ui/textarea";
import { X } from "lucide-react";
import { getStatusText } from "../../../utils/todoHelpers";

type TodoEditDialogProps = {
  todo: Todo;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Todo>) => void;
};

const TodoEditDialog = ({
  todo,
  isOpen,
  onClose,
  onSave,
}: TodoEditDialogProps) => {
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(
    todo.description || ""
  );
  const [editStatus, setEditStatus] = useState(todo.status);

  useEffect(() => {
    if (isOpen) {
      setEditTitle(todo.title);
      setEditDescription(todo.description || "");
      setEditStatus(todo.status);
    }
  }, [isOpen, todo]);

  const handleSave = () => {
    if (editTitle.trim()) {
      onSave({
        title: editTitle.trim(),
        description: editDescription.trim(),
        status: editStatus,
      });
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Enter task title..."
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <Textarea
            placeholder="Enter task description (optional)..."
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={3}
            className="resize-none max-h-24 overflow-y-auto"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {getStatusText(editStatus)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={() => setEditStatus("TODO")}>
                  To Do
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditStatus("IN_PROGRESS")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditStatus("COMPLETED")}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={!editTitle.trim()}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TodoEditDialog;
