import type { Todo } from "../../types";
import { useTodoItem } from "../../hooks/useTodoItem";
import TodoCard from "./components/TodoCard";
import TodoViewDialog from "./components/TodoViewDialog";
import TodoEditDialog from "./components/TodoEditDialog";

interface TodoItemProps {
  todo: Todo;
}

const TodoItem = ({ todo }: TodoItemProps) => {
  const {
    isViewDialogOpen,
    isEditDialogOpen,
    handleView,
    handleEdit,
    handleDelete,
    handleSave,
    handleCloseView,
    handleCloseEdit,
  } = useTodoItem(todo);

  return (
    <>
      <TodoCard
        todo={todo}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <TodoViewDialog
        todo={todo}
        isOpen={isViewDialogOpen}
        onClose={handleCloseView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <TodoEditDialog
        todo={todo}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEdit}
        onSave={handleSave}
      />
    </>
  );
};

export default TodoItem;
