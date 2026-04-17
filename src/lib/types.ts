export type PriorityLevel = "HIGH" | "MEDIUM" | "LOW";

export type UserPreferences = {
  id: string;
  name: string;
  email: string;
  theme: string;
  locale: string;
  notifications: boolean;
};

export type CategoryEntity = {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskEntity = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: PriorityLevel;
  dueDate: Date | null;
  userId: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskWithCategory = TaskEntity & {
  category: CategoryEntity | null;
};
