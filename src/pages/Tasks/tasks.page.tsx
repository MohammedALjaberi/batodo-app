import { useEffect } from "react";
import TasksHeader from "./components/TasksHeader";
import TaskCardView from "./components/TaskCardView";
import { useTodos } from "@/store/todo.store";
import EmptyView from "./components/EmptyView";
import TaskFormModal from "./modals/TaskFormModal";
import TaskViewModal from "./modals/TaskViewModal";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const TasksPage = () => {
  const todos = useTodos((state) => state.todos);
  const searchTerm = useTodos((state) => state.searchTerm);
  const searchedTodos = useTodos((state) => state.searchedTodos);
  const isLoading = useTodos((state) => state.isLoading);
  const error = useTodos((state) => state.error);
  const fetchTodos = useTodos((state) => state.fetchTodos);
  const setError = useTodos((state) => state.setError);

  const list = searchTerm ? searchedTodos : todos;
  const notasks = list.length === 0;

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Error component
  const ErrorDisplay = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">Error Loading Tasks</h3>
      <p className="text-muted-foreground mb-4">{error}</p>
      <Button
        onClick={() => {
          setError(null);
          fetchTodos();
        }}
        variant="outline"
      >
        Try Again
      </Button>
    </div>
  );

  // Loading component
  const LoadingDisplay = () => (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin mb-4" />
      <p className="text-muted-foreground">Loading tasks...</p>
    </div>
  );

  return (
    <div className="container mx-auto max-w-md p-4 py-8">
      <main>
        <TasksHeader className="mb-4" />
        {error ? (
          <ErrorDisplay />
        ) : isLoading ? (
          <LoadingDisplay />
        ) : notasks ? (
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
