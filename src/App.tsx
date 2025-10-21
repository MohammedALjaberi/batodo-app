import TasksPage from "./pages/Tasks/tasks.page";
import { ThemeProvider } from "@/components/theme-provider";
import "../i18n.config";

function App() {
  return (
    <ThemeProvider>
      <div className="bg-background min-h-screen transition-colors">
        <TasksPage />
      </div>
    </ThemeProvider>
  );
}

export default App;
