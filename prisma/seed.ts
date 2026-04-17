import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Demo12345", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@workspace.ar" },
    update: {},
    create: {
      name: "مستخدم تجريبي",
      email: "demo@workspace.ar",
      passwordHash,
      locale: "ar",
      theme: "system",
      notifications: true
    }
  });

  const categories = await Promise.all(
    [
      { name: "عمل", color: "#111111" },
      { name: "دراسة", color: "#5e5e5e" },
      { name: "شخصي", color: "#8c8c8c" }
    ].map((category) =>
      prisma.category.upsert({
        where: { userId_name: { userId: user.id, name: category.name } },
        update: category,
        create: { ...category, userId: user.id }
      })
    )
  );

  const existingTasks = await prisma.task.count({ where: { userId: user.id } });

  if (existingTasks === 0) {
    await prisma.task.createMany({
      data: [
        {
          title: "مراجعة الفصل الثالث من مادة قواعد البيانات",
          description: "تلخيص المفاهيم الأساسية ومراجعة التمارين",
          priority: "HIGH",
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
          userId: user.id,
          categoryId: categories[1].id
        },
        {
          title: "إرسال التحديث الأسبوعي لفريق المشروع",
          description: "مشاركة التقدم الحالي والخطوات القادمة",
          priority: "MEDIUM",
          userId: user.id,
          categoryId: categories[0].id
        },
        {
          title: "ترتيب قائمة مشتريات المنزل",
          completed: true,
          priority: "LOW",
          userId: user.id,
          categoryId: categories[2].id
        }
      ]
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
