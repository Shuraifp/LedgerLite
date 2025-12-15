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

  const name = formData.get("name") as string | undefined;
  const icon = formData.get("icon") as string | undefined;
  const color = formData.get("color") as string | undefined;

  await CategoryService.update(user.id, categoryId, {
    name,
    icon,
    color,
  });

  return { success: true };
}
