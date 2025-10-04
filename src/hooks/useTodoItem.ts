import { useState } from "react";
import type { Todo } from "../types";
import { useTodos } from "../store/todo.store";

export const useTodoItem = (todo: Todo) => {
  const { updateTodo, removeTodo } = useTodos();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleView = () => {
    setIsViewDialogOpen(true);
  };

  const handleEdit = () => {
    setIsViewDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    removeTodo(todo.id);
  };

  const handleSave = (updates: Partial<Todo>) => {
    updateTodo(todo.id, updates);
  };

  const handleCloseView = () => {
    setIsViewDialogOpen(false);
  };

  const handleCloseEdit = () => {
    setIsEditDialogOpen(false);
  };

  return {
    isViewDialogOpen,
    isEditDialogOpen,
    handleView,
    handleEdit,
    handleDelete,
    handleSave,
    handleCloseView,
    handleCloseEdit,
  };
};
