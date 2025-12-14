import type { ActionFunctionArgs } from "react-router";
import { AuthService } from "../../../services/auth.server";
import { data, redirect } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return data({ error: "Email and password are required" }, { status: 400 });
    }

    const { user, cookies } = await AuthService.login(email, password);

    return data({ success: true, user }, {
      status: 200,
      headers: cookies
    });

  } catch (error: any) {
    console.error("Login Failed:", error);
    return data({ error: error.message || "Invalid credentials" }, { status: 401 });
  }
}
