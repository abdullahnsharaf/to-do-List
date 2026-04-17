"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe, MoonStar, Plus, Save, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { deleteCategoryAction, updateSettingsAction, upsertCategoryAction } from "@/lib/actions";
import type { CategoryEntity, UserPreferences } from "@/lib/types";

export function SettingsPanel({
  user,
  categories
}: {
  user: UserPreferences;
  categories: CategoryEntity[];
}) {
  const [pending, startTransition] = useTransition();
  const [theme, setTheme] = useState<"light" | "dark" | "system">(
    (user.theme as "light" | "dark" | "system") ?? "system"
  );
  const [locale, setLocale] = useState<"ar" | "en">((user.locale as "ar" | "en") ?? "ar");
  const [notifications, setNotifications] = useState(user.notifications);
  const [categoryName, setCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const { setTheme: applyTheme } = useTheme();
  const router = useRouter();

  const saveSettings = () => {
    startTransition(async () => {
      const result = await updateSettingsAction({ theme, locale, notifications });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      applyTheme(theme);
      toast.success(result.message);
      router.refresh();
    });
  };

  const createCategory = () => {
    if (!categoryName.trim()) {
      const message = "اكتب اسم التصنيف أولًا.";
      setCategoryError(message);
      toast.error(message);
      return;
    }

    startTransition(async () => {
      const result = await upsertCategoryAction({ name: categoryName.trim(), color: "#111111" });

      if (!result.ok) {
        const message = result.fieldErrors?.name?.[0] ?? result.message;
        setCategoryError(message);
        toast.error(result.message);
        return;
      }

      setCategoryError("");
      setCategoryName("");
      toast.success(result.message);
      router.refresh();
    });
  };

  const deleteCategory = (categoryId: string) => {
    const confirmed = window.confirm("سيتم حذف التصنيف وفصل المهام المرتبطة به. هل تريد المتابعة؟");
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteCategoryAction(categoryId);
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
      <section>
        <h1 className="text-3xl font-bold">الإعدادات</h1>
        <p className="mt-2 text-sm text-text-soft">تحكم في تفضيلات واجهة العمل الخاصة بك.</p>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-6 shadow-ambient">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl bg-surface-low p-3">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">اللغة</h2>
              <p className="text-sm text-text-soft">اختر لغة الواجهة المفضلة للتطبيق.</p>
            </div>
          </div>
          <select
            value={locale}
            onChange={(event) => setLocale(event.target.value as "ar" | "en")}
            className="w-full rounded-2xl border border-outline-soft/40 bg-surface-low px-4 py-3 text-text-base outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-black/5"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-ambient">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl bg-surface-low p-3">
              <MoonStar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">المظهر</h2>
              <p className="text-sm text-text-soft">بدّل بين الفاتح والداكن أو دع النظام يختار.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ["light", "فاتح"],
              ["dark", "داكن"],
              ["system", "تلقائي"]
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTheme(value as "light" | "dark" | "system")}
                className={`rounded-full px-4 py-2 text-sm ${
                  theme === value ? "bg-primary text-white" : "bg-surface-low text-text-soft"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-ambient">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">التنبيهات</h2>
            <p className="text-sm text-text-soft">تفعيل أو تعطيل تنبيهات المهام والمواعيد النهائية.</p>
          </div>
          <button
            onClick={() => setNotifications((current) => !current)}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition ${
              notifications ? "bg-primary" : "bg-surface-dim"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 rounded-full bg-white transition ${
                notifications ? "-translate-x-1" : "-translate-x-9"
              }`}
            />
          </button>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-ambient">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">إدارة التصنيفات</h2>
            <p className="text-sm text-text-soft">نظّم مهامك بتصنيفات مخصصة تناسب أسلوبك.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={categoryName}
            onChange={(event) => {
              setCategoryName(event.target.value);
              if (categoryError) setCategoryError("");
            }}
            dir="rtl"
            className="flex-1 rounded-2xl border border-outline-soft/40 bg-surface-low px-4 py-3 text-text-base outline-none transition placeholder:text-text-soft/60 focus:border-primary focus:bg-white focus:ring-4 focus:ring-black/5"
            placeholder="إضافة تصنيف جديد"
          />
          <button
            onClick={createCategory}
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-surface-low px-4 py-3 text-sm font-semibold disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            إضافة
          </button>
        </div>
        {categoryError ? <p className="mt-3 text-sm text-danger">{categoryError}</p> : null}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between rounded-3xl bg-surface-low p-4">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="font-medium">{category.name}</span>
              </div>
              <button onClick={() => deleteCategory(category.id)} className="rounded-full p-2 hover:bg-white">
                <Trash2 className="h-4 w-4 text-text-soft" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <button
          onClick={saveSettings}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-soft disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          حفظ التغييرات
        </button>
      </div>
    </div>
  );
}
