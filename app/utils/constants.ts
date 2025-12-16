export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  TRANSACTIONS: "/transactions",
  API: {
    AUTH: {
      REGISTER: "/api/auth/register",
      LOGIN: "/api/auth/login",
      LOGOUT: "/api/auth/logout",
      REFRESH: "/api/auth/refresh",
    },
  },
};

export const CONFIG = {
  APP_NAME: "LedgerLite",
  AUTH: {
    PASSWORD_MIN_LENGTH: 6,
  },
};

export const TransactionType = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export interface Category {
  id: string;
  name: string;
  type: string;
  icon: string | null;
  color: string | null;
}