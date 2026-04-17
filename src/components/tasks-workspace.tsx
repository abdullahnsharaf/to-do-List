"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import {
  Calendar,
  Check,
  CircleX,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

import { createTaskAction, deleteTaskAction, toggleTaskAction, updateTaskAction } from "@/lib/actions";
import { EmptyState } from "@/components/empty-state";
import type { CategoryEntity, PriorityLevel, TaskWithCategory, UserPreferences } from "@/lib/types";
import { cn, formatTaskDate, getPriorityLabel, getPriorityTone, isOverdue } from "@/lib/utils";

type Workspace = {
  user: UserPreferences;
  tasks: TaskWithCategory[];
  categories: CategoryEntity[];
  stats: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
};

type Filters = {
  q?: string;
  status?: "all" | "completed" | "pending" | "priority" | "date";
  sort?: "newest" | "oldest" | "dueDate" | "priority";
};

const defaultForm = {
  title: "",
  description: "",
  priority: "MEDIUM" as PriorityLevel,
  categoryId: "",
  dueDate: ""
};

export function TasksWorkspace({
  initialData,
  initialFilters
}: {
  initialData: Workspace;
  initialFilters: Filters;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [form, setForm] = useState(defaultForm);
  const [editingTask, setEditingTask] = useState<TaskWithCategory | null>(null);
  const [searchValue, setSearchValue] = useState(initialFilters.q ?? "");

  const query = useMemo(() => initialFilters.q ?? "", [initialFilters.q]);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());

    if (!value || value === "all") {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    const queryString = next.toString();
    router.push((queryString ? `${pathname}?${queryString}` : pathname) as Route);
  };

  const submitCreate = () => {
    startTransition(async () => {
      const result = await createTaskAction(form);

      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.message);
        return;
      }

      setErrors({});
      toast.success(result.message);
      setForm(defaultForm);
      router.refresh();
    });
  };

  const submitEdit = () => {
    if (!editingTask) return;

    startTransition(async () => {
      const result = await updateTaskAction({
        id: editingTask.id,
        title: form.title,
        description: form.description,
        priority: form.priority,
        categoryId: form.categoryId || null,
        dueDate: form.dueDate || null,
        completed: editingTask.completed
      });

      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.message);
        return;
      }

      setErrors({});
      toast.success(result.message);
      setEditingTask(null);
      setForm(defaultForm);
      router.refresh();
    });
  };

  const openEdit = (task: TaskWithCategory) => {
    setEditingTask(task);
    setErrors({});
    setForm({
      title: task.title,
      description: task.description ?? "",
      priority: task.priority,
      categoryId: task.categoryId ?? "",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ""
    });
  };

  const resetEditor = () => {
    setEditingTask(null);
    setErrors({});
    setForm(defaultForm);
  };

  const handleDelete = (taskId: string) => {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذه المهمة؟");
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteTaskAction(taskId);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  };

  const handleToggle = (taskId: string, completed: boolean) => {
    startTransition(async () => {
      const result = await toggleTaskAction(taskId, completed);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-white px-4 py-2 text-sm shadow-ambient">الكل: {initialData.stats.total}</span>
        <span className="rounded-full bg-white px-4 py-2 text-sm shadow-ambient">
          مكتملة: {initialData.stats.completed}
        </span>
        <span className="rounded-full bg-white px-4 py-2 text-sm shadow-ambient">
          غير مكتملة: {initialData.stats.pending}
        </span>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-ambient">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">{editingTask ? "تعديل المهمة" : "إضافة مهمة سريعة"}</h2>
          {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
          <div>
            <label className="mb-2 block text-xs font-semibold text-text-soft">عنوان المهمة</label>
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              dir="rtl"
              autoComplete="off"
              className="w-full rounded-2xl border border-outline-soft/40 bg-surface-low px-4 py-3 text-text-base outline-none transition placeholder:text-text-soft/60 focus:border-primary focus:bg-white focus:ring-4 focus:ring-black/5"
              placeholder="أضف مهمة جديدة..."
            />
            {errors.title?.[0] ? <p className="mt-2 text-xs text-danger">{errors.title[0]}</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-text-soft">التصنيف</label>
            <select
              value={form.categoryId}
              onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
              className="w-full rounded-2xl border border-outline-soft/40 bg-surface-low px-4 py-3 text-text-base outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-black/5"
            >
              <option value="">بدون تصنيف</option>
              {initialData.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-text-soft">الأولوية</label>
            <select
              value={form.priority}
              onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value as PriorityLevel }))}
              className="w-full rounded-2xl border border-outline-soft/40 bg-surface-low px-4 py-3 text-text-base outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-black/5"
            >
              <option value="HIGH">عالية</option>
              <option value="MEDIUM">متوسطة</option>
              <option value="LOW">منخفضة</option>
            </select>
          </div>

          <div className="self-end">
            <div className="flex gap-2">
              {editingTask ? (
                <button
                  onClick={resetEditor}
                  className="inline-flex min-w-24 items-center justify-center gap-2 rounded-2xl bg-surface-low px-4 py-3 text-sm font-semibold text-text-soft transition hover:bg-surface-high"
                >
                  <CircleX className="h-4 w-4" />
                  إلغاء
                </button>
              ) : null}
              <button
                onClick={editingTask ? submitEdit : submitCreate}
                disabled={pending}
                className="inline-flex min-w-32 items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-soft disabled:opacity-60"
              >
                {editingTask ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingTask ? "حفظ" : "إضافة"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[1.4fr_0.8fr]">
          <div>
            <label className="mb-2 block text-xs font-semibold text-text-soft">الوصف</label>
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              dir="rtl"
              className="min-h-28 w-full rounded-2xl border border-outline-soft/40 bg-surface-low px-4 py-3 text-text-base outline-none transition placeholder:text-text-soft/60 focus:border-primary focus:bg-white focus:ring-4 focus:ring-black/5"
              placeholder="أضف تفاصيل اختيارية..."
            />
            {errors.description?.[0] ? <p className="mt-2 text-xs text-danger">{errors.description[0]}</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-text-soft">التاريخ</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
              className="w-full rounded-2xl border border-outline-soft/40 bg-surface-low px-4 py-3 text-text-base outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-black/5"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-[2rem] bg-white p-5 shadow-ambient">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
          <div className="flex items-center gap-3 rounded-2xl bg-surface-low px-4 py-3">
            <Search className="h-4 w-4 text-text-soft" />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  updateFilter("q", searchValue);
                }
              }}
              dir="rtl"
              className="w-full border-none bg-transparent p-0 text-sm focus:ring-0"
              placeholder="ابحث في المهام أو التصنيفات"
            />
            <button
              onClick={() => updateFilter("q", searchValue)}
              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-text-base shadow-ambient"
            >
              بحث
            </button>
            {query ? (
              <button
                onClick={() => {
                  setSearchValue("");
                  updateFilter("q", "");
                }}
                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-text-soft shadow-ambient"
              >
                مسح
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              ["all", "الكل"],
              ["completed", "مكتملة"],
              ["pending", "غير مكتملة"],
              ["priority", "الأولوية"],
              ["date", "التاريخ"]
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => updateFilter("status", value)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  (initialFilters.status ?? "all") === value ? "bg-primary text-white" : "bg-surface-low text-text-soft"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <select
            value={initialFilters.sort ?? "newest"}
            onChange={(event) => updateFilter("sort", event.target.value)}
            className="rounded-2xl border-none bg-surface-low px-4 py-3 text-sm"
          >
            <option value="newest">الأحدث</option>
            <option value="oldest">الأقدم</option>
            <option value="dueDate">تاريخ الاستحقاق</option>
            <option value="priority">الأولوية</option>
          </select>
        </div>
      </section>

      {initialData.tasks.length === 0 ? (
        <EmptyState title="لا توجد مهام مطابقة" description="جرّب تغيير الفلاتر أو أضف مهمة جديدة للبدء." />
      ) : (
        <section className="grid gap-6 md:grid-cols-2">
          {initialData.tasks.map((task) => (
            <article
              key={task.id}
              className={cn(
                "rounded-[2rem] bg-white p-6 shadow-ambient transition hover:-translate-y-0.5",
                task.completed && "bg-surface-low",
                isOverdue(task.dueDate, task.completed) && "ring-1 ring-danger/20"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <input
                    checked={task.completed}
                    onChange={(event) => handleToggle(task.id, event.target.checked)}
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-outline-soft text-primary focus:ring-0"
                  />
                  <div>
                    <h3 className={cn("text-lg font-semibold", task.completed && "text-text-soft line-through")}>
                      {task.title}
                    </h3>
                    {task.description ? (
                      <p className="mt-3 text-sm leading-7 text-text-soft">{task.description}</p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-text-soft">
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface-low px-3 py-1">
                        <Calendar className="h-3 w-3" />
                        {formatTaskDate(task.dueDate)}
                      </span>
                      {task.category ? (
                        <span className="rounded-full bg-surface-low px-3 py-1">{task.category.name}</span>
                      ) : null}
                      <span className={`rounded-full px-3 py-1 font-semibold ${getPriorityTone(task.priority)}`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(task)}
                    className="rounded-full bg-surface-low p-2 text-text-soft transition hover:bg-surface-high hover:text-text-base"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="rounded-full bg-surface-low p-2 text-text-soft transition hover:bg-danger-soft hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
