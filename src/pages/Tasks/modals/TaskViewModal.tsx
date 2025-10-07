import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useTodos } from "@/store/todo.store";
import { getStatusColor, getStatusText } from "@/utils/todoHelpers";
import { X } from "lucide-react";
import { format } from "date-fns";

const TaskViewModal = () => {
  const { t } = useTranslation();
  const currentTask = useTodos((s) => s.currentTask);
  const openModalFor = useTodos((s) => s.openModalFor);
  const setOpenModal = useTodos((s) => s.setOpenModal);
  const setCurrentTask = useTodos((s) => s.setCurrentTask);
  const removeTodo = useTodos((s) => s.removeTodo);

  const isOpen = openModalFor === "view";

  const handleDialogChange = () => {
    setOpenModal(null);
    setCurrentTask(null);
  };

  const handleEdit = () => {
    setOpenModal("edit");
  };

  const handleDelete = () => {
    if (currentTask) {
      removeTodo(currentTask.id);
      setOpenModal(null);
      setCurrentTask(null);
    }
  };

  if (!currentTask) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("modal.taskDetails")}</DialogTitle>
          <button
            onClick={handleDialogChange}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("task.title")}
            </label>
            <p className="mt-1 text-sm text-foreground">{currentTask.title}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("task.description")}
            </label>
            <p className="mt-1 text-sm text-muted-foreground">
              {currentTask.description || t("task.noDescription")}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("task.status")}
            </label>
            <div className="mt-1">
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                  getStatusColor(currentTask.status)
                )}
              >
                {getStatusText(currentTask.status)}
              </span>
            </div>
          </div>

          {/* Date Range Section */}
          {(currentTask.startDate || currentTask.endDate) && (
            <div className="grid grid-cols-2 gap-4">
              {currentTask.startDate && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t("task.startDate")}
                  </label>
                  <p className="mt-1 text-sm text-foreground">
                    {format(currentTask.startDate, "PPP")}
                  </p>
                </div>
              )}
              {currentTask.endDate && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t("task.endDate")}
                  </label>
                  <p className="mt-1 text-sm text-foreground">
                    {format(currentTask.endDate, "PPP")}
                  </p>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-600"
            >
              {t("buttons.delete")}
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              {t("buttons.edit")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskViewModal;
