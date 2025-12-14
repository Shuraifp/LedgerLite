import type { LoaderFunctionArgs } from "react-router";
import { AuthService } from "../../../services/auth.server";
import { data } from "react-router";
import { parse } from "cookie";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const cookies = parse(cookieHeader || "");
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      return data({ error: "No refresh token" }, { status: 401 });
    }

    const newCookies = await AuthService.refresh(refreshToken);

    return data({ success: true }, {
      status: 200,
      headers: newCookies
    });

  } catch (error: any) {
    console.error("Refresh Failed:", error.message);
    // If refresh fails, forcefully logout
    const logoutCookies = await AuthService.logout();
    return data({ error: "Session expired" }, {
      status: 401,
      headers: logoutCookies
    });
  }
}
