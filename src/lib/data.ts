import { subDays } from "date-fns";

import { prisma } from "@/lib/db";
import type { CategoryEntity, TaskWithCategory, UserPreferences } from "@/lib/types";
import { isOverdue } from "@/lib/utils";

export type TaskFilters = {
  q?: string;
  status?: "all" | "completed" | "pending" | "priority" | "date";
  sort?: "newest" | "oldest" | "dueDate" | "priority";
};

export async function getUserWorkspace(userId: string, filters: TaskFilters = {}) {
  const where = {
    userId,
    ...(filters.q
      ? {
          OR: [
            { title: { contains: filters.q, mode: "insensitive" as const } },
            { description: { contains: filters.q, mode: "insensitive" as const } },
            { category: { name: { contains: filters.q, mode: "insensitive" as const } } }
          ]
        }
      : {}),
    ...(filters.status === "completed" ? { completed: true } : {}),
    ...(filters.status === "pending" ? { completed: false } : {}),
    ...(filters.status === "priority" ? { priority: "HIGH" as const } : {}),
    ...(filters.status === "date" ? { dueDate: { not: null } } : {})
  };

  const orderBy =
    filters.sort === "oldest"
      ? [{ createdAt: "asc" as const }]
      : filters.sort === "dueDate"
        ? [{ dueDate: "asc" as const }, { createdAt: "desc" as const }]
        : filters.sort === "priority"
          ? [{ priority: "asc" as const }, { createdAt: "desc" as const }]
          : [{ createdAt: "desc" as const }];

  const [user, tasks, categories] = (await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        theme: true,
        locale: true,
        notifications: true
      }
    }),
    prisma.task.findMany({
      where,
      orderBy,
      include: {
        category: true
      }
    }),
    prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" }
    })
  ])) as [UserPreferences, TaskWithCategory[], CategoryEntity[]];

  const allTasks = (await prisma.task.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { createdAt: "desc" }
  })) as TaskWithCategory[];

  const stats = {
    total: allTasks.length,
    completed: allTasks.filter((task) => task.completed).length,
    pending: allTasks.filter((task) => !task.completed).length,
    overdue: allTasks.filter((task) => isOverdue(task.dueDate, task.completed)).length
  };

  return { user, tasks, categories, stats };
}

export async function getDashboardData(userId: string) {
  const [recentTasks, categories, tasks] = (await Promise.all([
    prisma.task.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" }
    }),
    prisma.task.findMany({
      where: { userId },
      include: { category: true }
    })
  ])) as [TaskWithCategory[], CategoryEntity[], TaskWithCategory[]];

  const sevenDaysAgo = subDays(new Date(), 7);

  const productivity = {
    doneThisWeek: tasks.filter((task) => task.completed && task.updatedAt >= sevenDaysAgo).length,
    focusCategory:
      categories
        .map((category) => ({
          ...category,
          count: tasks.filter((task) => task.categoryId === category.id).length
        }))
        .sort((left, right) => right.count - left.count)[0] ?? null
  };

  return {
    recentTasks,
    stats: {
      total: tasks.length,
      completed: tasks.filter((task) => task.completed).length,
      pending: tasks.filter((task) => !task.completed).length,
      overdue: tasks.filter((task) => isOverdue(task.dueDate, task.completed)).length
    },
    productivity
  };
}
