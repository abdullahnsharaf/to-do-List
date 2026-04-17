import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { taskSchema } from "@/lib/validators";

type Context = {
  params: Promise<{ taskId: string }>;
};

export async function PATCH(request: Request, context: Context) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  const { taskId } = await context.params;
  const json = await request.json();
  const parsed = taskSchema.safeParse({ ...json, id: taskId });

  if (!parsed.success) {
    return NextResponse.json({ message: "بيانات غير صالحة", errors: parsed.error.flatten() }, { status: 400 });
  }

  const task = await prisma.task.update({
    where: { id_userId: { id: taskId, userId: session.user.id } },
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      priority: parsed.data.priority,
      categoryId: parsed.data.categoryId || null,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      completed: parsed.data.completed
    },
    include: { category: true }
  });

  return NextResponse.json(task);
}

export async function DELETE(_: Request, context: Context) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  const { taskId } = await context.params;

  await prisma.task.delete({
    where: {
      id_userId: {
        id: taskId,
        userId: session.user.id
      }
    }
  });

  return NextResponse.json({ ok: true });
}
