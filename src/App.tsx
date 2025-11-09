import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import TasksPage from "./pages/Tasks/tasks.page";
import BlogsPage from "./pages/Blogs/blogs.page";
import "../i18n.config";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="bg-background min-h-screen transition-colors">
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
