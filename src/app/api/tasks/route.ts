import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { taskSchema } from "@/lib/validators";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = taskSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: "بيانات غير صالحة", errors: parsed.error.flatten() }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      priority: parsed.data.priority,
      categoryId: parsed.data.categoryId || null,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      userId: session.user.id
    },
    include: { category: true }
  });

  return NextResponse.json(task, { status: 201 });
}
