import { z } from "zod";

export const createTaskFormSchema = (t: (key: string) => string) =>
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
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
    dateRange: z
      .object({
        from: z.date(),
        to: z.date().optional(),
      })
      .optional()
      .refine(
        (data) => {
          if (data?.from && data?.to) {
            return data.from <= data.to;
          }
          return true;
        },
        {
          message: t("validation.endDateAfterStart"),
          path: ["to"],
        }
      ),
  });

export type TaskFormData = z.infer<ReturnType<typeof createTaskFormSchema>>;
