import { data, type ActionFunctionArgs } from "react-router";
import { AuthService } from "~/services/auth.server";
import { CategoryService } from "~/services/category.server";
import { TransactionType } from "~/utils/constants";

export async function action({ request }: ActionFunctionArgs) {
  const user = await AuthService.requireAuthenticatedUser(request);
  const formData = await request.formData();

  const name = formData.get("name") as string;
  const type = formData.get("type") as TransactionType;
  const icon = formData.get("icon") as string;

  if (!name || !type) {
    return data({ error: "Name and Type are required" }, { status: 400 });
  }

  try {
    const category = await CategoryService.create(user.id, name, type, icon || undefined);
    return { success: true, category };
  } catch (error) {
    console.error(error);
    return data({ error: "Failed to create category" }, { status: 500 });
  }
}