# Arabic To-Do Workspace

تطبيق عربي احترافي لإدارة المهام مبني بـ `Next.js App Router` مع `Tailwind CSS` و`Prisma` و`NextAuth`.

المنتج مصمم بروح تحريرية أحادية اللون مستوحاة من wireframes المرفقة، مع دعم RTL كامل، لوحة تحكم، صفحة مهام تفاعلية، إعدادات، مصادقة آمنة، وتجهيز واضح للنشر على Vercel.

## لماذا هذا الـ Stack؟

- `Next.js`: يجمع الواجهة، API routes، الصفحات المحمية، وSSR في مشروع واحد مناسب للنشر السريع.
- `Tailwind CSS`: ممتاز لبناء نظام تصميم مخصص مطابق للـ wireframes مع RTL واستجابة قوية.
- `Prisma + PostgreSQL`: قاعدة بيانات واضحة وقابلة للتوسع مع schema صريح وسهل الصيانة.
- `NextAuth Credentials`: جلسات آمنة وسهلة الدمج مع Prisma لتسجيل الدخول والبقاء داخل نفس منصة Next.js.

## الميزات المنفذة

- الصفحة الرئيسية التسويقية العربية.
- تسجيل الدخول.
- إنشاء حساب.
- تسجيل الخروج.
- جلسات مصادقة محمية للمسارات الداخلية.
- لوحة تحكم بإحصاءات:
  - إجمالي المهام
  - المهام المكتملة
  - المهام غير المكتملة
  - المهام المتأخرة
- صفحة مهام كاملة:
  - إضافة مهمة
  - تعديل مهمة
  - حذف مهمة
  - تعليم كمكتملة أو غير مكتملة
  - أولوية عالية / متوسطة / منخفضة
  - تاريخ اختياري
  - تصنيف اختياري
  - بحث
  - فلترة
  - ترتيب
- صفحة إعدادات:
  - اللغة
  - الوضع الفاتح/الداكن/التلقائي
  - التنبهيات
  - إدارة التصنيفات
- API routes للمهام.
- Toast messages.
- Empty states.
- صفحة 404 عربية.

## هيكل المشروع

```text
to-do-List/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (app)/
│   │   ├── api/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── lib/
│   ├── middleware.ts
│   └── types/
├── .env.example
├── package.json
├── prisma.config.ts
└── README.md
```

## متطلبات التشغيل المحلي

- `Node.js 20+`
- قاعدة PostgreSQL محلية أو مستضافة

## إعداد البيئة

انسخ ملف البيئة:

```bash
cp .env.example .env
```

ثم عدل القيم التالية:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
AUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

### ملاحظات مهمة

- `DATABASE_URL` يفضل أن يكون connection string مخصص للتطبيق.
- `DIRECT_URL` استخدمه لو كنت تعتمد مزودًا مثل Supabase أو Neon للاتصال المباشر أثناء المايجريشن.
- `AUTH_SECRET` أنشئه بقيمة طويلة وعشوائية.

## أوامر التطوير

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

ثم افتح:

```text
http://localhost:3000
```

## بيانات تجريبية

بعد تشغيل:

```bash
npm run db:seed
```

يمكنك استخدام:

- البريد: `demo@workspace.ar`
- كلمة المرور: `Demo12345`

## النشر على Vercel

1. ارفع المشروع إلى GitHub.
2. أنشئ مشروعًا جديدًا في Vercel واربط المستودع.
3. أنشئ قاعدة PostgreSQL على Supabase أو Neon أو Vercel Postgres.
4. أضف المتغيرات التالية في Vercel:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL`
5. اجعل `NEXTAUTH_URL` هو رابط المشروع الفعلي بعد النشر.
6. في أول تشغيل:
   - نفذ `npx prisma db push`
   - ثم `npm run db:seed` إذا أردت بيانات أولية

## خطوات نشر مقترحة

```bash
npm install
npx prisma generate
npx prisma db push
npm run build
```

## ما تم التحقق منه داخل هذه الجلسة

- اكتمال بناء الكودbase.
- نجاح فحص TypeScript عبر:

```bash
npx tsc --noEmit
```

## ما لم يكتمل آليًا داخل هذه الجلسة

تعذر إكمال `prisma generate`/`npm run build` بسبب حظر الشبكة على تنزيل Prisma engine من:

```text
https://binaries.prisma.sh
```

هذا ليس خطأ في الكود نفسه، بل قيد بيئي في الجلسة الحالية. عند تشغيل نفس الخطوات في بيئة متصلة بالشبكة أو على Vercel، يجب أن تُحمّل محركات Prisma بشكل طبيعي.
