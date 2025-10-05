import TasksHeader from "./components/TasksHeader";
import TaskCardView from "./components/TaskCardView";
import { useTodos } from "@/store/todo.store";
import EmptyView from "./components/EmptyView";
import TaskFormModal from "./modals/TaskFormModal";
import TaskViewModal from "./modals/TaskViewModal";

const TasksPage = () => {
  const todos = useTodos((state) => state.todos);
  const searchTerm = useTodos((state) => state.searchTerm);
  const searchedTodos = useTodos((state) => state.searchedTodos);

  const list = searchTerm ? searchedTodos : todos;
  const notasks = list.length === 0;

  return (
    <div className="container mx-auto max-w-md p-4">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Todo App</h1>
      </header>
      <main>
        <TasksHeader className="mb-4" />
        {notasks ? (
          <EmptyView />
        ) : (
          <div className="space-y-4">
            {list.map((todo) => {
              return <TaskCardView key={todo.id} todo={todo} />;
            })}
          </div>
        )}
      </main>
      {/* ? modals */}
      <TaskFormModal />
      <TaskViewModal />
    </div>
  );
};

export default TasksPage;
