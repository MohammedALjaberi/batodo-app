import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { useTranslation } from "react-i18next";
import { CheckSquare, FileText } from "lucide-react";

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    {
      path: "/tasks",
      label: t("nav.tasks", "Tasks"),
      icon: CheckSquare,
    },
    {
      path: "/blogs",
      label: t("nav.blogs", "Blogs"),
      icon: FileText,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">
              {t("app.title", "BaTODO")}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
                    transition-colors duration-200
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

