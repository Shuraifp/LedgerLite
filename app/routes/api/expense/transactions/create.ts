import { data, type ActionFunctionArgs } from "react-router";
import { AuthService } from "~/services/auth.server";
import { TransactionService } from "~/services/transaction.server";
import { TransactionType } from "~/utils/constants";

export async function action({ request }: ActionFunctionArgs) {
  const user = await AuthService.requireAuthenticatedUser(request);
  const formData = await request.formData();

  const amount = parseFloat(formData.get("amount") as string);
  const title = formData.get("title") as string;
  const categoryId = formData.get("categoryId") as string;
  const type = formData.get("type") as TransactionType;
  const dateStr = formData.get("date") as string;

  if (!amount || !title || !categoryId || !type) {
    return data({ error: "Missing required fields" }, { status: 400 });
  }

  await TransactionService.create(user.id, {
    amount,
    title,
    categoryId,
    type,
    date: dateStr ? new Date(dateStr) : new Date(),
  });

  return { success: true };
}
