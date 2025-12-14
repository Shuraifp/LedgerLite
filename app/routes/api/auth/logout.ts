import type { ActionFunctionArgs } from "react-router";
import { AuthService } from "../../../services/auth.server";
import { redirect } from "react-router";
import { parse } from "cookie";
import { ROUTES } from "~/utils/constants";

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookies = parse(cookieHeader || "");

  const headers = await AuthService.logout(cookies.refreshToken);

  return redirect(ROUTES.LOGIN, { headers });
}
