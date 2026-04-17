import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, CheckCircle2, LayoutDashboard, ShieldCheck, Sparkles } from "lucide-react";

import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();
  const features: Array<{ title: string; description: string; icon: LucideIcon }> = [
    {
      title: "مصادقة آمنة",
      description: "تسجيل حساب، دخول وخروج مع جلسات آمنة.",
      icon: ShieldCheck
    },
    {
      title: "لوحة تركيز",
      description: "إحصاءات واضحة ومهام حديثة لمساعدتك على القرار.",
      icon: LayoutDashboard
    },
    {
      title: "تدفق يومي",
      description: "بحث، فلترة، ترتيب، وتحديث فوري للحالة.",
      icon: CheckCircle2
    }
  ];

  return (
    <main className="min-h-screen bg-surface px-4 py-6 text-text-base md:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col rounded-[2rem] bg-white/80 p-6 shadow-ambient backdrop-blur md:p-8">
        <header className="flex flex-col gap-6 border-b border-outline-soft/30 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-text-soft">نظام إنتاجية عربي مصمم بروح تحريرية حديثة</p>
            <h1 className="mt-3 text-3xl font-bold md:text-5xl">المساحة الإبداعية لتنظيم يومك باحتراف</h1>
          </div>
          <div className="flex gap-3 self-start">
            <Link
              href={session ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-soft"
            >
              {session ? "الانتقال إلى لوحة التحكم" : "ابدأ الآن"}
              <ArrowLeft className="h-4 w-4" />
            </Link>
            {!session ? (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-surface-low px-5 py-3 text-sm font-semibold text-text-base transition hover:bg-surface-high"
              >
                تسجيل الدخول
              </Link>
            ) : null}
          </div>
        </header>

        <section className="grid flex-1 gap-6 pt-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] bg-hero-grid p-8 shadow-ambient">
            <div className="max-w-2xl animate-fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-text-base">
                <Sparkles className="h-4 w-4" />
                مبني خصيصًا لواجهة عربية RTL حقيقية
              </span>
              <h2 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
                قوائم مهام سريعة، لوحة متابعة ذكية، وتجربة تبدو كمنتج ناشئ حقيقي.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-text-soft">
                أنشئ مهامك، رتّب أولوياتك، تابع الإنجاز اليومي، وعدّل إعداداتك من مساحة عمل أنيقة
                ومريحة بصريًا على الجوال والكمبيوتر.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-3xl bg-white/85 p-5 shadow-ambient">
                  <feature.icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-text-soft">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] bg-[#111111] p-6 text-white shadow-ambient">
              <p className="text-sm text-white/70">لماذا هذا الاتجاه؟</p>
              <h3 className="mt-3 text-2xl font-bold">تصميم أحادي اللون يرفع التركيز بدل تشتيته</h3>
              <p className="mt-3 text-sm leading-7 text-white/75">
                اعتمدنا طبقات ناعمة ومساحات بيضاء وتباينًا مضبوطًا، مستوحى من Todoist وNotion وLinear
                لكن بقراءة عربية طبيعية وواجهة نظيفة.
              </p>
            </div>
            <div className="rounded-[2rem] bg-surface-low p-6">
              <p className="text-sm font-medium text-text-soft">الصفحات المتوفرة</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-text-base">
                <li>الصفحة الرئيسية العامة</li>
                <li>تسجيل الدخول وإنشاء حساب</li>
                <li>لوحة التحكم</li>
                <li>صفحة المهام الكاملة</li>
                <li>صفحة الإعدادات وإدارة التصنيفات</li>
                <li>صفحة 404 عربية بسيطة</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
