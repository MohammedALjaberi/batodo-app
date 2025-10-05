import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTodos } from "@/store/todo.store";
import { Plus } from "lucide-react";

const TasksHeader = (props: { className: string }) => {
  const { className } = props;
  const setOpenModal = useTodos((s) => s.setOpenModal);
  const searchTerm = useTodos((s) => s.searchTerm);
  const handleSearchChange = useTodos((s) => s.handleSearchChange);

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="flex gap-3">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
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
