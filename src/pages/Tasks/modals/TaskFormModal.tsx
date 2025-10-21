import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/ui/dialog";
import { CustomSelect } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { CustomPopover } from "@/components/ui/popover";
import { CustomField } from "@/components/ui/field";
import { useTodos } from "@/store/todo.store";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useState } from "react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true);
      if (isNew) {
        await addTodo(
          data.title,
          data?.description,
          data.dateRange?.from,
          data.dateRange?.to
        );
      } else {
        await updateTodo(currentTask?.id ?? "", {
          title: data.title,
          description: data?.description,
          status: data?.status,
          startDate: data.dateRange?.from,
          endDate: data.dateRange?.to,
        });
      }
      setCurrentTask(null);
      setOpenModal(null);
    } catch (error) {
      // Error is handled by the store
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col gap-3">
        <CustomField
          label={t("task.title")}
          error={errors.title?.message}
          required
          htmlFor="title"
        >
          <Input
            id="title"
            placeholder={t("placeholder.enterTitle")}
            {...register("title")}
            autoFocus
          />
        </CustomField>

        <CustomField
          label={t("task.description")}
          error={errors.description?.message}
          htmlFor="description"
        >
          <Textarea
            id="description"
            placeholder={t("placeholder.enterDescription")}
            {...register("description")}
            rows={3}
            className="resize-none max-h-24 overflow-y-auto"
          />
        </CustomField>

        <CustomField
          label={t("task.dateRange")}
          error={errors.dateRange?.to?.message}
        >
          <CustomPopover
            trigger={
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
            }
            contentClassName="w-auto p-0"
            align="start"
          >
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
          </CustomPopover>
        </CustomField>
      </div>

      {openModalFor === "edit" && (
        <CustomField label={t("task.status")}>
          <CustomSelect
            value={watchedStatus}
            onValueChange={(value) =>
              setValue("status", value as "TODO" | "IN_PROGRESS" | "DONE")
            }
            options={[
              { label: t("status.todo"), value: "TODO" },
              { label: t("status.inProgress"), value: "IN_PROGRESS" },
              { label: t("status.completed"), value: "DONE" },
            ]}
            className="w-full justify-start"
          />
        </CustomField>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {t("buttons.saving")}
            </>
          ) : (
            t("buttons.done")
          )}
        </Button>
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

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setOpenModal(null);
      setCurrentTask(null);
    }
  };

  return (
    <CustomDialog
      open={isOpen}
      onOpenChange={handleDialogChange}
      title={isNew ? t("modal.addTask") : t("modal.editTask")}
      className="sm:max-w-md"
    >
      <Form />
    </CustomDialog>
  );
};

export default TaskFormModal;
