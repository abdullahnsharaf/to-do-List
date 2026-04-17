"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LayoutDashboard, LogOut, Settings, SquareCheckBig } from "lucide-react";

import { logoutUserAction } from "@/lib/actions";
import { appName, navigationItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap = {
  "/dashboard": LayoutDashboard,
  "/tasks": SquareCheckBig,
  "/settings": Settings
};

export function AppShell({
  children,
  user
}: {
  children: React.ReactNode;
  user: { id: string; name?: string | null; email?: string | null };
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-surface text-[color:var(--text-main)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="glass-panel hidden w-80 shrink-0 border-l border-outline-soft/25 p-6 lg:flex lg:flex-col">
          <div>
            <p className="text-lg font-bold">{appName}</p>
            <p className="text-sm theme-text-muted">نظام إدارة العمل</p>
          </div>

          <nav className="mt-10 space-y-2">
            {navigationItems.map((item) => {
              const Icon = iconMap[item.href as keyof typeof iconMap];
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    active
                      ? "translate-x-[-4px] theme-card text-primary shadow-ambient"
                      : "theme-text-muted hover:bg-[color:var(--card-muted)] hover:text-[color:var(--text-main)]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="rounded-[2rem] bg-[#111111] p-5 text-white">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="mt-1 text-xs text-white/65">{user.email}</p>
            </div>

            <form action={logoutUserAction}>
              <button className="theme-card flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-ambient transition hover:opacity-90">
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </button>
            </form>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="glass-panel sticky top-0 z-20 flex items-center justify-between border-b border-outline-soft/25 px-4 py-4 md:px-8">
            <div>
              <p className="text-2xl font-bold">
                {pathname === "/dashboard" ? "لوحة التحكم" : pathname === "/settings" ? "الإعدادات" : "قائمة المهام"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="theme-card rounded-full px-4 py-2 text-xs font-medium theme-text-muted shadow-ambient">
                {user.name}
              </span>
              <button className="theme-card rounded-full p-3 shadow-ambient">
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 pb-24 md:px-8 lg:pb-6">{children}</main>
        </div>
      </div>

      <nav className="glass-panel fixed inset-x-4 bottom-4 z-30 flex items-center justify-around rounded-[1.75rem] border border-outline-soft/25 p-3 shadow-ambient lg:hidden">
        {navigationItems.map((item) => {
          const Icon = iconMap[item.href as keyof typeof iconMap];
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-24 flex-col items-center gap-1 rounded-2xl px-4 py-2 text-xs font-medium",
                active ? "bg-primary text-white" : "theme-text-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
