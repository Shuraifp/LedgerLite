import { data, type ActionFunctionArgs } from "react-router";
import { AuthService } from "../../../services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      return data({ error: "Missing name, email or password" }, { status: 400 });
    }

    const { user, cookies } = await AuthService.register(name, email, password);

    return data({ success: true, user }, { status: 201, headers: cookies });
  } catch (error: any) {
    console.error("Registration failed:", error);
    return data({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}