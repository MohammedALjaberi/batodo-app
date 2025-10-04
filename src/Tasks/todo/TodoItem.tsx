import { useState } from "react";
import type { Todo } from "../../types";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Edit, Trash2, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useTodos } from "../../store/todo.store";
import { getStatusColor, getStatusText } from "../../utils/todoHelpers";
import { Textarea } from "@/components/ui/textarea";

interface TodoItemProps {
  todo: Todo;
}

const TodoItem = ({ todo }: TodoItemProps) => {
  const { updateTodo, removeTodo } = useTodos();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(
    todo.description || ""
  );
  const [editStatus, setEditStatus] = useState(todo.status);

  const handleUpdateTask = () => {
    if (editTitle.trim()) {
      updateTodo(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        status: editStatus,
      });
      setIsEditDialogOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdateTask();
    }
  };

  return (
    <>
      <div className="group relative bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
        <div
          className="flex items-center justify-between"
          onClick={() => setIsViewDialogOpen(true)}
        >
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
                setEditTitle(todo.title);
                setEditDescription(todo.description || "");
                setEditStatus(todo.status);
                setIsEditDialogOpen(true);
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
                removeTodo(todo.id);
              }}
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
            <button
              onClick={() => setIsViewDialogOpen(false)}
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
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
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
                onClick={() => {
                  removeTodo(todo.id);
                }}
                className="text-red-500 hover:text-red-500"
              >
                Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewDialogOpen(false);
                  setEditTitle(todo.title);
                  setEditDescription(todo.description || "");
                  setEditStatus(todo.status);
                  setIsEditDialogOpen(true);
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <button
              onClick={() => setIsEditDialogOpen(false)}
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
              onKeyPress={handleKeyPress}
              rows={3}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {getStatusText(editStatus)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => setEditStatus("TODO")}>
                    To Do
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setEditStatus("IN_PROGRESS")}
                  >
                    In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEditStatus("COMPLETED")}>
                    Completed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleUpdateTask} disabled={!editTitle.trim()}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TodoItem;
