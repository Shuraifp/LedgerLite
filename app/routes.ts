import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("transactions", "routes/transactions.tsx"),
  route("categories", "routes/categories.tsx"),

  // API Routes
  route("api/auth/register", "routes/api/auth/register.ts"),
  route("api/auth/login", "routes/api/auth/login.ts"),
  route("api/auth/refresh", "routes/api/auth/refresh.ts"),
  route("api/auth/logout", "routes/api/auth/logout.ts"),
  route("api/expense/categories/create", "routes/api/expense/categories/create.ts"),
  route("api/expense/transactions/create", "routes/api/expense/transactions/create.ts"),
  route("api/expense/transactions/update", "routes/api/expense/transactions/update.ts"),
  route("api/expense/transactions/delete", "routes/api/expense/transactions/delete.ts"),
  route("api/expense/categories/delete", "routes/api/expense/categories/delete.ts"),
  route("api/expense/categories/update", "routes/api/expense/categories/update.ts"),
] satisfies RouteConfig;
