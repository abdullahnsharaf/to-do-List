"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { loginUserAction, registerUserAction } from "@/lib/actions";

type FieldErrors = Record<string, string[] | undefined>;

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const result =
        mode === "register"
          ? await registerUserAction({ name, email, password })
          : await loginUserAction({ email, password });

      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.message);
        return;
      }

      setErrors({});
      toast.success(result.message);
      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {mode === "register" ? (
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold text-text-base">
            الاسم الكامل
          </label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            dir="rtl"
            className="w-full rounded-2xl border border-outline-soft/40 bg-surface-low px-4 py-3 text-base text-text-base outline-none transition placeholder:text-text-soft/60 focus:border-primary focus:bg-white focus:ring-4 focus:ring-black/5"
            placeholder="اكتب اسمك الكامل"
          />
          {errors.name?.[0] ? <p className="text-sm text-danger">{errors.name[0]}</p> : null}
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-text-base">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete={mode === "register" ? "email" : "username"}
          dir="ltr"
          className="w-full rounded-2xl border border-outline-soft/40 bg-surface-low px-4 py-3 text-left text-base text-text-base outline-none transition placeholder:text-text-soft/60 focus:border-primary focus:bg-white focus:ring-4 focus:ring-black/5"
          placeholder="name@example.com"
        />
        {errors.email?.[0] ? <p className="text-sm text-danger">{errors.email[0]}</p> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-semibold text-text-base">
          كلمة المرور
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            dir="ltr"
            className="w-full rounded-2xl border border-outline-soft/40 bg-surface-low px-4 py-3 pl-12 text-left text-base text-text-base outline-none transition placeholder:text-text-soft/60 focus:border-primary focus:bg-white focus:ring-4 focus:ring-black/5"
            placeholder="ثمانية أحرف على الأقل"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute inset-y-0 left-3 inline-flex items-center text-text-soft transition hover:text-text-base"
            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password?.[0] ? <p className="text-sm text-danger">{errors.password[0]}</p> : null}
      </div>

      <div className="rounded-2xl bg-surface-low px-4 py-3 text-sm leading-7 text-text-soft">
        {mode === "register"
          ? "استخدم اسمك الحقيقي وبريدًا إلكترونيًا صحيحًا حتى تتمكن من تسجيل الدخول بسهولة لاحقًا."
          : "أدخل نفس البريد الإلكتروني وكلمة المرور اللذين استخدمتهما عند إنشاء الحساب."}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-soft disabled:opacity-60"
      >
        {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
        {mode === "register" ? "إنشاء الحساب" : "تسجيل الدخول"}
      </button>
    </form>
  );
}
