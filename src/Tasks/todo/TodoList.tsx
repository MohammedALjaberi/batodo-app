import { useTodos } from "../../store/todo.store";
import TodoInput from "./TodoInput";
import TodoItem from "./TodoItem";

const TodoList = () => {
  const todos = useTodos((state) => state.todos);
  const searchTerm = useTodos((state) => state.searchTerm);
  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <TodoInput />
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks found.</p>
            <p className="text-sm mt-1">Add a new task to get started!</p>
          </div>
        ) : (
          filteredTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        )}
      </div>
    </div>
  );
};

export default TodoList;
