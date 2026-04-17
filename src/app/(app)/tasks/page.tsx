import { auth } from "@/auth";
import { TasksWorkspace } from "@/components/tasks-workspace";
import { getUserWorkspace } from "@/lib/data";

type Props = {
  searchParams: Promise<{
    q?: string;
    status?: "all" | "completed" | "pending" | "priority" | "date";
    sort?: "newest" | "oldest" | "dueDate" | "priority";
  }>;
};

export default async function TasksPage({ searchParams }: Props) {
  const session = await auth();
  const filters = await searchParams;
  const workspace = await getUserWorkspace(session!.user!.id, filters);

  return <TasksWorkspace initialData={workspace} initialFilters={filters} />;
}
