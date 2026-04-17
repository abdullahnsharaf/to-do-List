import Link from "next/link";

import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-ambient lg:grid-cols-[1.05fr_0.95fr]">
        <section className="bg-surface-low p-10">
          <p className="text-sm text-text-soft">ابدأ تنظيم يومك من أول جلسة</p>
          <h1 className="mt-4 text-4xl font-bold">إنشاء حساب</h1>
          <p className="mt-4 max-w-md text-base leading-8 text-text-soft">
            سنجهز لك مساحة عمل عربية جاهزة مع تصنيفات أساسية وإعدادات افتراضية تساعدك على الانطلاق بسرعة.
          </p>
        </section>
        <section className="p-6 md:p-10">
          <AuthForm mode="register" />
          <p className="mt-6 text-center text-sm text-text-soft">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="font-semibold text-primary">
              تسجيل الدخول
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
