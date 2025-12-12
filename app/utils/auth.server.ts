import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { serialize, type CookieSerializeOptions } from "cookie";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "default_access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret";

// --- Password Hashing ---
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

// --- JWT Operations ---
export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: string, familyId: string) => {
  return jwt.sign({ userId, familyId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string; familyId: string };
  } catch (error) {
    return null;
  }
};

// --- Cookies ---
const cookieOptions: CookieSerializeOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export const createAuthCookies = (accessToken: string, refreshToken: string) => {
  const accessCookie = serialize("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60, // 15 mins
  });

  const refreshCookie = serialize("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return { 
    "Set-Cookie": [accessCookie, refreshCookie] 
  };
};

export const clearAuthCookies = () => {
  const accessCookie = serialize("accessToken", "", {
    ...cookieOptions,
    maxAge: 0,
  });
  
  const refreshCookie = serialize("refreshToken", "", {
    ...cookieOptions,
    maxAge: 0,
  });

  return { 
    "Set-Cookie": [accessCookie, refreshCookie] 
  };
};
