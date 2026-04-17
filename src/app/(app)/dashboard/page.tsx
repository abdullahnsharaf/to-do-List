import { AlertTriangle, CheckCircle2, Clock3, ListTodo } from "lucide-react";

import { auth } from "@/auth";
import { EmptyState } from "@/components/empty-state";
import { StatsCard } from "@/components/stats-card";
import { getDashboardData } from "@/lib/data";
import { formatTaskDate, getPriorityLabel, getPriorityTone } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  const data = await getDashboardData(session!.user!.id);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-[#111111] px-6 py-8 text-white md:px-8">
        <p className="text-sm text-white/70">أهلًا {session?.user?.name}</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">لوحة تحكم مصممة لتبقيك في مسار الإنجاز</h1>
        <p className="mt-3 max-w-2xl text-sm leading-8 text-white/75 md:text-base">
          راقب حجم العمل الحالي، عدد المهام المكتملة، وما الذي يحتاج إلى انتباهك الفوري اليوم.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="إجمالي المهام" value={data.stats.total} icon={ListTodo} />
        <StatsCard title="المهام المكتملة" value={data.stats.completed} icon={CheckCircle2} />
        <StatsCard title="المهام غير المكتملة" value={data.stats.pending} icon={Clock3} />
        <StatsCard title="المهام المتأخرة" value={data.stats.overdue} icon={AlertTriangle} tone="danger" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-ambient">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">المهام الحديثة</h2>
              <p className="text-sm text-text-soft">آخر ما تمت إضافته إلى مساحة العمل الخاصة بك.</p>
            </div>
          </div>
          {data.recentTasks.length === 0 ? (
            <EmptyState title="لا توجد مهام بعد" description="ابدأ بإضافة أول مهمة من صفحة المهام." />
          ) : (
            <div className="space-y-4">
              {data.recentTasks.map((task) => (
                <div key={task.id} className="rounded-3xl bg-surface-low p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="mt-1 text-sm text-text-soft">{formatTaskDate(task.dueDate)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.category ? (
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium">{task.category.name}</span>
                      ) : null}
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityTone(task.priority)}`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-ambient">
            <h2 className="text-xl font-bold">نبض الإنتاجية</h2>
            <p className="mt-2 text-sm leading-7 text-text-soft">
              أنجزت هذا الأسبوع <span className="font-bold text-primary">{data.productivity.doneThisWeek}</span> مهمة.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-soft">
              {data.productivity.focusCategory
                ? `أكثر تصنيف نشاطًا حاليًا هو ${data.productivity.focusCategory.name}.`
                : "عند إنشاء التصنيفات والمهام ستظهر هنا قراءة سريعة لنمط عملك."}
            </p>
          </div>
          <div className="rounded-[2rem] bg-surface-low p-6">
            <h3 className="text-xl font-bold">اقتراح عملي</h3>
            <p className="mt-3 text-sm leading-7 text-text-soft">
              أوصي بإضافة تاريخ استحقاق للمهمات عالية الأولوية فقط، حتى تبقى الصفحة خفيفة ولا تتحول
              المواعيد إلى ضوضاء مستمرة.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
