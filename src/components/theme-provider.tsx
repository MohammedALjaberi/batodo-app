import { useEffect } from "react";
import { useThemeStore } from "@/store/theme.store";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return <>{children}</>;
}
// eslint-disable-next-line react-refresh/only-export-components
export { useTheme } from "@/store/theme.store";
