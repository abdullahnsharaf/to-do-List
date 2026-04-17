import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("أدخل بريدًا إلكترونيًا صحيحًا"),
  password: z.string().min(8, "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل")
});

export const signUpSchema = signInSchema.extend({
  name: z.string().min(2, "الاسم قصير جدًا").max(60, "الاسم طويل جدًا")
});

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "اسم التصنيف قصير").max(30, "اسم التصنيف طويل"),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "لون غير صالح")
    .default("#111111")
});

export const taskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "عنوان المهمة يجب أن يحتوي على 3 أحرف على الأقل").max(140),
  description: z.string().max(400).optional().or(z.literal("")),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
  categoryId: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  completed: z.boolean().default(false)
});

export const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  notifications: z.boolean(),
  locale: z.enum(["ar", "en"])
});
