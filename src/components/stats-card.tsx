import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatsCard({
  title,
  value,
  icon: Icon,
  tone = "default"
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  tone?: "default" | "danger";
}) {
  return (
    <div
      className={cn(
        "rounded-[2rem] bg-white p-5 shadow-ambient",
        tone === "danger" && "bg-danger-soft/60"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-soft">{title}</p>
          <p className="mt-3 text-3xl font-bold">{value}</p>
        </div>
        <div className={cn("rounded-2xl p-3", tone === "danger" ? "bg-white/80" : "bg-surface-low")}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
