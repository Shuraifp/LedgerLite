import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("dashboard", "routes/dashboard.tsx"),

  // API Routes
  route("api/auth/register", "routes/api/auth/register.ts"),
  route("api/auth/login", "routes/api/auth/login.ts"),
  route("api/auth/refresh", "routes/api/auth/refresh.ts"),
  route("api/auth/logout", "routes/api/auth/logout.ts"),
] satisfies RouteConfig;
