import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTodos } from "@/store/todo.store";
import { getStatusText } from "@/utils/todoHelpers";
import { Dialog } from "@radix-ui/react-dialog";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  createTaskFormSchema,
  type TaskFormData,
} from "../schemas/taskFormSchema";

const Form = () => {
  const { t, i18n } = useTranslation();
  const currentTask = useTodos((s) => s.currentTask);
  const setCurrentTask = useTodos((s) => s.setCurrentTask);
  const addTodo = useTodos((s) => s.addTodo);
  const updateTodo = useTodos((s) => s.updateTodo);
  const setOpenModal = useTodos((s) => s.setOpenModal);
  const openModalFor = useTodos((s) => s.openModalFor);
  const isNew = openModalFor === "new";

  const taskFormSchema = createTaskFormSchema(t);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: currentTask?.title || "",
      description: currentTask?.description || "",
      status: currentTask?.status || "TODO",
      dateRange: currentTask?.startDate
        ? {
            from: currentTask.startDate,
            to: currentTask.endDate,
          }
        : undefined,
    },
  });

  const watchedStatus = watch("status");
  const watchedDateRange = watch("dateRange");

  const onSubmit = (data: TaskFormData) => {
    if (isNew) {
      addTodo(
        data.title,
        data?.description,
        data.dateRange?.from,
        data.dateRange?.to
      );
    } else {
      updateTodo(currentTask?.id ?? "", {
        title: data.title,
        description: data?.description,
        status: data?.status,
        startDate: data.dateRange?.from,
        endDate: data.dateRange?.to,
      });
    }
    setCurrentTask(null);
    setOpenModal(null);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="title">{t("task.title")}</Label>
        <Input
          id="title"
          placeholder={t("placeholder.enterTitle")}
          {...register("title")}
          autoFocus
        />
        {errors.title && (
          <span className="text-sm text-red-400 -mt-1">
            {errors.title.message}
          </span>
        )}

        <Label htmlFor="description">{t("task.description")}</Label>
        <Textarea
          id="description"
          placeholder={t("placeholder.enterDescription")}
          {...register("description")}
          rows={3}
          className="resize-none max-h-24 overflow-y-auto"
        />
        {errors.description && (
          <span className="text-sm text-red-400 -mt-1">
            {errors.description.message}
          </span>
        )}

        {/* Date Range Section */}
        <div className="flex flex-col gap-2">
          <Label>{t("task.dateRange")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`justify-start font-normal ${
                  i18n.language === "ar" ? "text-right" : "text-left"
                } ${!watchedDateRange?.from && "text-muted-foreground"}`}
              >
                <CalendarIcon
                  className={`h-4 w-4 ${
                    i18n.language === "ar" ? "ml-2" : "mr-2"
                  }`}
                />
                {watchedDateRange?.from ? (
                  watchedDateRange.to ? (
                    <>
                      {format(watchedDateRange.from, "LLL dd, y", {
                        locale: i18n.language === "ar" ? ar : undefined,
                      })}{" "}
                      -{" "}
                      {format(watchedDateRange.to, "LLL dd, y", {
                        locale: i18n.language === "ar" ? ar : undefined,
                      })}
                    </>
                  ) : (
                    format(watchedDateRange.from, "LLL dd, y", {
                      locale: i18n.language === "ar" ? ar : undefined,
                    })
                  )
                ) : (
                  <span>{t("placeholder.selectDateRange")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={watchedDateRange?.from}
                selected={watchedDateRange}
                onSelect={(range) => {
                  if (range?.from) {
                    setValue("dateRange", {
                      from: range.from,
                      to: range.to,
                    });
                  } else {
                    setValue("dateRange", undefined);
                  }
                }}
                numberOfMonths={1}
                style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
                lang={i18n.language}
                locale={i18n.language === "ar" ? ar : undefined}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.dateRange?.to && (
            <span className="text-sm text-red-400">
              {errors.dateRange.to.message}
            </span>
          )}
        </div>
      </div>

      {openModalFor === "edit" && (
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            {t("task.status")}
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {getStatusText(watchedStatus)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={() => setValue("status", "TODO")}>
                {t("status.todo")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setValue("status", "IN_PROGRESS")}
              >
                {t("status.inProgress")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setValue("status", "COMPLETED")}>
                {t("status.completed")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit">{t("buttons.done")}</Button>
      </div>
    </form>
  );
};

const TaskFormModal = () => {
  const { t } = useTranslation();
  const openModalFor = useTodos((s) => s.openModalFor);
  const setOpenModal = useTodos((s) => s.setOpenModal);
  const setCurrentTask = useTodos((s) => s.setCurrentTask);
  const isOpen = ["edit", "new"].includes(openModalFor ?? "");
  const isNew = openModalFor === "new";

  const handleDialogChange = () => {
    setOpenModal(null);
    setCurrentTask(null);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isNew ? t("modal.addTask") : t("modal.editTask")}
            </DialogTitle>
            <button
              onClick={handleDialogChange}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>
          <Form />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskFormModal;
