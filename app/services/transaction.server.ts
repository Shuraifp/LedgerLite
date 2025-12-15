import { db } from "../db/index.server";
import { transactions, categories } from "../db/schema";
import { eq, and, desc, sql, gte, lte } from "drizzle-orm";
import { TransactionType } from "~/utils/constants";

export class TransactionService {
  static async create(userId: string, data: {
    categoryId: string;
    amount: number;
    title?: string;
    date?: Date;
    type: TransactionType;
  }) {
    const [transaction] = await db.insert(transactions).values({
      userId,
      categoryId: data.categoryId,
      amount: data.amount.toString(),
      title: data.title,
      date: data.date || new Date(),
      type: data.type,
    }).returning();
    return transaction;
  }

  static async getRecent(userId: string, limit = 5) {
    return db.select({
      id: transactions.id,
      amount: transactions.amount,
      type: transactions.type,
      date: transactions.date,
      title: transactions.title,
      categoryName: categories.name,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
    })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(and(eq(transactions.userId, userId), eq(transactions.isDeleted, false)))
      .orderBy(desc(transactions.date))
      .limit(limit);
  }

  static async getSummary(userId: string) {
    const [result] = await db.select({
      totalIncome: sql<string>`coalesce(sum(case when ${transactions.type} = 'income' then ${transactions.amount} else 0 end), 0)`,
      totalExpense: sql<string>`coalesce(sum(case when ${transactions.type} = 'expense' then ${transactions.amount} else 0 end), 0)`,
    })
      .from(transactions)
      .where(and(eq(transactions.userId, userId), eq(transactions.isDeleted, false)));

    const income = parseFloat(result?.totalIncome || '0');
    const expense = parseFloat(result?.totalExpense || '0');

    return {
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense
    };
  }
  static async update(userId: string, transactionId: string, data: {
    categoryId?: string;
    amount?: number;
    title?: string;
    date?: Date;
    type?: TransactionType;
  }) {
    const updateData: any = {};
    if (data.categoryId) updateData.categoryId = data.categoryId;
    if (data.amount !== undefined) updateData.amount = data.amount.toString();
    if (data.title !== undefined) updateData.title = data.title;
    if (data.date) updateData.date = data.date;
    if (data.type) updateData.type = data.type;
    updateData.updatedAt = new Date();

    const [updatedTransaction] = await db.update(transactions)
      .set(updateData)
      .where(and(eq(transactions.id, transactionId), eq(transactions.userId, userId)))
      .returning();
    return updatedTransaction;
  }

  static async delete(userId: string, transactionId: string) {
    await db.update(transactions)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(and(eq(transactions.id, transactionId), eq(transactions.userId, userId)));
  }

  static async getByDateRange(userId: string, startDate: Date, endDate: Date) {
    return db.select({
      date: transactions.date,
      amount: transactions.amount,
      type: transactions.type,
    })
      .from(transactions)
      .where(and(
        eq(transactions.userId, userId),
        eq(transactions.isDeleted, false),
        gte(transactions.date, startDate),
        lte(transactions.date, endDate)
      ))
      .orderBy(transactions.date);
  }

  static async getChartData(userId: string, period: 'week' | 'month') {
    const now = new Date();
    const startDate = new Date();

    if (period === 'week') {
      startDate.setDate(now.getDate() - 6); // Last 7 days including today
    } else {
      startDate.setDate(1); // First day of current month
    }

    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    const data = await this.getByDateRange(userId, startDate, endDate);

    // Group by date
    const grouped: Record<string, { income: number; expense: number }> = {};

    data.forEach(tx => {
      const dateKey = new Date(tx.date).toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = { income: 0, expense: 0 };
      }

      const amount = parseFloat(tx.amount);
      if (tx.type === 'income') {
        grouped[dateKey].income += amount;
      } else {
        grouped[dateKey].expense += amount;
      }
    });

    return grouped;
  }
}
