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
import { useTodos } from "@/store/todo.store";
import { getStatusText } from "@/utils/todoHelpers";
import { Dialog } from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";

// Create schema function to use translations
const createTaskFormSchema = (t: any) =>
  z.object({
    title: z
      .string()
      .min(1, t("validation.titleRequired"))
      .max(50, t("validation.titleMaxLength"))
      .trim(),
    description: z
      .string()
      .max(200, t("validation.descriptionMaxLength"))
      .optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]),
  });

type FormDataT = z.infer<ReturnType<typeof createTaskFormSchema>>;

const Form = () => {
  const { t } = useTranslation();
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
  } = useForm<FormDataT>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: currentTask?.title || "",
      description: currentTask?.description || "",
      status: currentTask?.status || "TODO",
    },
  });

  const watchedStatus = watch("status");

  const onSubmit = (data: FormDataT) => {
    if (isNew) {
      addTodo(data.title, data.description);
    } else {
      updateTodo(currentTask?.id ?? "", data);
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
              // onClick={}
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
