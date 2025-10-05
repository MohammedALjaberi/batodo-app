import TasksHeader from "./components/TasksHeader";
import TaskCardView from "./components/TaskCardView";
import { useTodos } from "@/store/todo.store";
import EmptyView from "./components/EmptyView";
import TaskFormModal from "./modals/TaskFormModal";
import TaskViewModal from "./modals/TaskViewModal";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useTranslation } from "react-i18next";

const TasksPage = () => {
  const { t } = useTranslation();
  const todos = useTodos((state) => state.todos);
  const searchTerm = useTodos((state) => state.searchTerm);
  const searchedTodos = useTodos((state) => state.searchedTodos);

  const list = searchTerm ? searchedTodos : todos;
  const notasks = list.length === 0;

  return (
    <div className="container mx-auto max-w-md p-4">
      <header className="text-center mb-6">
        <div className="flex items-center justify-between my-4">
          <h1 className="text-2xl font-bold text-foreground">
            {t("app.title")}
          </h1>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
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
