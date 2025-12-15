import { data, type ActionFunctionArgs } from "react-router";
import { AuthService } from "~/services/auth.server";
import { TransactionService } from "~/services/transaction.server";

export async function action({ request }: ActionFunctionArgs) {
  const user = await AuthService.requireAuthenticatedUser(request);
  const formData = await request.formData();

  const transactionId = formData.get("transactionId") as string;

  if (!transactionId) {
    return data({ error: "Missing transaction ID" }, { status: 400 });
  }

  await TransactionService.delete(user.id, transactionId);

  return { success: true };
}
