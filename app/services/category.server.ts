import type { TransactionType } from "~/utils/constants";
import { db } from "../db/index.server";
import { categories } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";

export class CategoryService {
  static async create(userId: string, name: string, type: TransactionType, icon?: string, color?: string) {
    const [category] = await db.insert(categories).values({
      userId,
      name,
      type,
      icon,
      color,
    }).returning();
    return category;
  }

  static async list(userId: string, type?: TransactionType) {
    const filters = [eq(categories.userId, userId), eq(categories.isDeleted, false)];
    if (type) {
      filters.push(eq(categories.type, type));
    }

    return db.select()
      .from(categories)
      .where(and(...filters))
      .orderBy(desc(categories.createdAt));
  }

  static async delete(userId: string, categoryId: string) {
    await db.update(categories)
      .set({ isDeleted: true })
      .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)));
  }
  static async update(userId: string, categoryId: string, data: { name?: string; icon?: string; color?: string }) {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.icon) updateData.icon = data.icon;
    if (data.color) updateData.color = data.color;
    updateData.updatedAt = new Date();

    const [updatedCategory] = await db.update(categories)
      .set(updateData)
      .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))
      .returning();
    return updatedCategory;
  }
}
