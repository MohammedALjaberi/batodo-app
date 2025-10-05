import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTodos } from "@/store/todo.store";
import { Plus } from "lucide-react";
import debounce from "lodash.debounce";

const TasksHeader = (props: { className: string }) => {
  const { className } = props;
  const setOpenModal = useTodos((s) => s.setOpenModal);
  const inputValue = useTodos((s) => s.inputValue);
  const setInputValue = useTodos((s) => s.setInputValue);
  const performSearch = useTodos((s) => s.performSearch);

  const debouncedSearch = useCallback(debounce(performSearch, 500), [
    performSearch,
  ]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="flex gap-3">
          <Input
            placeholder="Search tasks..."
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={() => {
              setOpenModal("new");
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TasksHeader;
