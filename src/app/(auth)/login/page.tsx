import Link from "next/link";

import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] theme-card shadow-ambient lg:grid-cols-[1.05fr_0.95fr]">
        <section className="bg-[#111111] p-10 text-white">
          <p className="text-sm text-white/65">مرحبًا بعودتك إلى مساحة العمل</p>
          <h1 className="mt-4 text-4xl font-bold">تسجيل الدخول</h1>
          <p className="mt-4 max-w-md text-base leading-8 text-white/75">
            تابع مهامك اليومية، راقب تقدّمك، واستعد تركيزك من خلال واجهة عربية مصممة لتكون هادئة
            وعملية في نفس الوقت.
          </p>
        </section>

        <section className="p-6 md:p-10">
          <AuthForm mode="login" />
          <p className="mt-6 text-center text-sm theme-text-muted">
            ليس لديك حساب؟{" "}
            <Link href="/register" className="font-semibold text-primary">
              إنشاء حساب
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
