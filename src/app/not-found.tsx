import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="max-w-lg rounded-[2rem] bg-white p-10 text-center shadow-ambient">
        <span className="text-sm font-medium text-text-soft">404</span>
        <h1 className="mt-3 text-4xl font-bold">الصفحة غير موجودة</h1>
        <p className="mt-4 text-base leading-8 text-text-soft">
          يبدو أن الرابط الذي تحاول الوصول إليه لم يعد موجودًا أو تمت كتابته بشكل غير صحيح.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-soft"
        >
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </main>
  );
}
