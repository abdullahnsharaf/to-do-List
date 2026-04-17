"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { loginUserAction, registerUserAction } from "@/lib/actions";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
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
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "register" ? (
        <div>
          <label className="mb-2 block text-sm font-semibold">الاسم</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-2xl border-none bg-surface-low px-4 py-3"
            placeholder="اكتب اسمك الكامل"
          />
        </div>
      ) : null}
      <div>
        <label className="mb-2 block text-sm font-semibold">البريد الإلكتروني</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border-none bg-surface-low px-4 py-3"
          placeholder="name@example.com"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold">كلمة المرور</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border-none bg-surface-low px-4 py-3"
          placeholder="ثمانية أحرف على الأقل"
        />
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
