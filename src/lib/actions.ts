"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import type { Route } from "next";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { categorySchema, settingsSchema, signUpSchema, taskSchema } from "@/lib/validators";

type ActionResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

function success(message: string): ActionResult {
  return { ok: true, message };
}

function failure(message: string, fieldErrors?: Record<string, string[] | undefined>): ActionResult {
  return { ok: false, message, fieldErrors };
}

export async function registerUserAction(input: FormData | Record<string, unknown>): Promise<ActionResult> {
  const values =
    input instanceof FormData
      ? Object.fromEntries(input.entries())
      : input;

  const parsed = signUpSchema.safeParse(values);

  if (!parsed.success) {
    return failure("تحقق من البيانات المدخلة.", parsed.error.flatten().fieldErrors);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email }
  });

  if (existingUser) {
    return failure("هذا البريد مستخدم بالفعل.");
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash
    }
  });

  await Promise.all(
    [
      { name: "عمل", color: "#111111" },
      { name: "دراسة", color: "#5e5e5e" },
      { name: "شخصي", color: "#8c8c8c" }
    ].map((category) =>
      prisma.category.create({
        data: {
          ...category,
          userId: user.id
        }
      })
    )
  );

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return failure("تم إنشاء الحساب لكن تعذر تسجيل الدخول تلقائيًا.");
    }
    throw error;
  }

  return success("تم إنشاء الحساب بنجاح.");
}

export async function loginUserAction(input: FormData | Record<string, unknown>): Promise<ActionResult> {
  const values =
    input instanceof FormData
      ? Object.fromEntries(input.entries())
      : input;

  try {
    await signIn("credentials", {
      email: String(values.email ?? ""),
      password: String(values.password ?? ""),
      redirect: false
    });

    return success("مرحبًا بعودتك.");
  } catch (error) {
    if (error instanceof AuthError) {
      return failure("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
    }

    throw error;
  }
}

export async function logoutUserAction() {
  await signOut({ redirectTo: "/" });
}

export async function createTaskAction(input: Record<string, unknown>): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = taskSchema.safeParse(input);

  if (!parsed.success) {
    return failure("تعذر إنشاء المهمة.", parsed.error.flatten().fieldErrors);
  }

  await prisma.task.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      priority: parsed.data.priority,
      categoryId: parsed.data.categoryId || null,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      completed: false,
      userId: user.id
    }
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return success("تمت إضافة المهمة بنجاح.");
}

export async function updateTaskAction(input: Record<string, unknown>): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = taskSchema.safeParse(input);

  if (!parsed.success || !parsed.data.id) {
    return failure("تعذر تحديث المهمة.", parsed.success ? undefined : parsed.error.flatten().fieldErrors);
  }

  await prisma.task.update({
    where: {
      id_userId: {
        id: parsed.data.id,
        userId: user.id
      }
    },
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      priority: parsed.data.priority,
      categoryId: parsed.data.categoryId || null,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      completed: parsed.data.completed
    }
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return success("تم تحديث المهمة.");
}

export async function toggleTaskAction(taskId: string, completed: boolean): Promise<ActionResult> {
  const user = await requireUser();

  await prisma.task.update({
    where: {
      id_userId: {
        id: taskId,
        userId: user.id
      }
    },
    data: { completed }
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return success(completed ? "تم تحديد المهمة كمكتملة." : "تمت إعادة المهمة إلى غير مكتملة.");
}

export async function deleteTaskAction(taskId: string): Promise<ActionResult> {
  const user = await requireUser();

  await prisma.task.delete({
    where: {
      id_userId: {
        id: taskId,
        userId: user.id
      }
    }
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return success("تم حذف المهمة.");
}

export async function upsertCategoryAction(input: Record<string, unknown>): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = categorySchema.safeParse(input);

  if (!parsed.success) {
    return failure("تعذر حفظ التصنيف.", parsed.error.flatten().fieldErrors);
  }

  if (parsed.data.id) {
    await prisma.category.update({
      where: {
        id_userId: {
          id: parsed.data.id,
          userId: user.id
        }
      },
      data: {
        name: parsed.data.name,
        color: parsed.data.color
      }
    });
  } else {
    await prisma.category.create({
      data: {
        name: parsed.data.name,
        color: parsed.data.color,
        userId: user.id
      }
    });
  }

  revalidatePath("/settings");
  revalidatePath("/tasks");
  return success("تم حفظ التصنيف.");
}

export async function deleteCategoryAction(categoryId: string): Promise<ActionResult> {
  const user = await requireUser();

  await prisma.category.delete({
    where: {
      id_userId: {
        id: categoryId,
        userId: user.id
      }
    }
  });

  revalidatePath("/settings");
  revalidatePath("/tasks");
  return success("تم حذف التصنيف.");
}

export async function updateSettingsAction(input: Record<string, unknown>): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = settingsSchema.safeParse(input);

  if (!parsed.success) {
    return failure("تعذر حفظ الإعدادات.", parsed.error.flatten().fieldErrors);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: parsed.data
  });

  revalidatePath("/settings");
  return success("تم حفظ التغييرات.");
}

export async function redirectAfterAuth(path: string) {
  redirect(path as Route);
}
