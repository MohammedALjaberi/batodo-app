import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTodos } from "@/store/todo.store";
import { Plus, Search, Loader2 } from "lucide-react";
import debounce from "lodash.debounce";

const TasksHeader = (props: { className: string }) => {
  const { className } = props;
  const { t } = useTranslation();
  const setOpenModal = useTodos((s) => s.setOpenModal);
  const inputValue = useTodos((s) => s.inputValue);
  const setInputValue = useTodos((s) => s.setInputValue);
  const performSearch = useTodos((s) => s.performSearch);
  const isLoading = useTodos((s) => s.isLoading);
  const searchTerm = useTodos((s) => s.searchTerm);

  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      await performSearch(searchTerm);
    }, 500),
    [performSearch]
  );

  const handleInputChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Input
              placeholder={t("search.placeholder")}
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="pl-10"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              {isLoading && searchTerm ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <Search className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
          <Button
            onClick={() => {
              setOpenModal("new");
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("buttons.addTask")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TasksHeader;
