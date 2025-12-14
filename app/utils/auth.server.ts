import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { serialize, parse, type SerializeOptions } from "cookie";
export { parse };

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "default_access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

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

const cookieOptions: SerializeOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export const createAuthCookies = (accessToken: string, refreshToken: string) => {
  const accessCookie = serialize("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60,
  });

  const refreshCookie = serialize("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60,
  });

  const headers = new Headers();
  headers.append("Set-Cookie", accessCookie);
  headers.append("Set-Cookie", refreshCookie);

  return headers;
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

  const headers = new Headers();
  headers.append("Set-Cookie", accessCookie);
  headers.append("Set-Cookie", refreshCookie);

  return headers;
};
