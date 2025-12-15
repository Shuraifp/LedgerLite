import { data, type ActionFunctionArgs } from "react-router";
import { AuthService } from "~/services/auth.server";
import { CategoryService } from "~/services/category.server";

export async function action({ request }: ActionFunctionArgs) {
  const user = await AuthService.requireAuthenticatedUser(request);
  const formData = await request.formData();

  const categoryId = formData.get("categoryId") as string;

  if (!categoryId) {
    return data({ error: "Missing category ID" }, { status: 400 });
  }

  await CategoryService.delete(user.id, categoryId);

  return { success: true };
}
