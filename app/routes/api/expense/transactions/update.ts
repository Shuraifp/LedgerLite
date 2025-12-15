import { data, type ActionFunctionArgs } from "react-router";
import { AuthService } from "~/services/auth.server";
import { TransactionService } from "~/services/transaction.server";
import { TransactionType } from "~/utils/constants";

export async function action({ request }: ActionFunctionArgs) {
  const user = await AuthService.requireAuthenticatedUser(request);
  const formData = await request.formData();

  const transactionId = formData.get("transactionId") as string;

  if (!transactionId) {
    return data({ error: "Missing transaction ID" }, { status: 400 });
  }

  const amount = formData.get("amount") ? parseFloat(formData.get("amount") as string) : undefined;
  const title = formData.get("title") as string | undefined;
  const categoryId = formData.get("categoryId") as string | undefined;
  const type = formData.get("type") as TransactionType | undefined;
  const dateStr = formData.get("date") as string;

  await TransactionService.update(user.id, transactionId, {
    amount,
    title,
    categoryId,
    type,
    date: dateStr ? new Date(dateStr) : undefined,
  });

  return { success: true };
}
