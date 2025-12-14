import { db } from "../db/index.server";
import { users, refreshTokens } from "../db/schema";
import { eq, and, lt, desc, inArray } from "drizzle-orm";
import { redirect } from "react-router";
import { ROUTES } from "../utils/constants";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  createAuthCookies
} from "../utils/auth.server";
import { v4 as uuidv4 } from "uuid";

export class AuthService {

  static async login(email: string, passwordRaw: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user || !(await comparePassword(passwordRaw, user.passwordHash))) {
      throw new Error("Invalid email or password");
    }

    await db.delete(refreshTokens).where(
      and(
        eq(refreshTokens.userId, user.id),
        lt(refreshTokens.expiresAt, new Date())
      )
    );

    const activeTokens = await db
      .select({ id: refreshTokens.id })
      .from(refreshTokens)
      .where(eq(refreshTokens.userId, user.id))
      .orderBy(desc(refreshTokens.createdAt));

    if (activeTokens.length >= 5) {
      const tokensToDelete = activeTokens.slice(4).map(t => t.id);
      if (tokensToDelete.length > 0) {
        await db.delete(refreshTokens).where(inArray(refreshTokens.id, tokensToDelete));
      }
    }

    const familyId = uuidv4();
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id, familyId);
    const [savedToken] = await db.insert(refreshTokens).values({
      userId: user.id,
      hashedToken: await hashPassword(refreshToken),
      familyId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }).returning();

    const cookies = createAuthCookies(accessToken, refreshToken);

    return {
      user: { id: user.id, email: user.email },
      cookies
    };
  }

  static async register(username: string, email: string, passwordRaw: string) {
    const [existing] = await db.select().from(users).where(eq(users.email, email));
    if (existing) throw new Error("User already exists");

    const hashedPassword = await hashPassword(passwordRaw);
    const [newUser] = await db.insert(users).values({
      username,
      email,
      passwordHash: hashedPassword,
    }).returning();

    return this.login(email, passwordRaw);
  }

  static async refresh(refreshTokenRaw: string) {
    if (!refreshTokenRaw) throw new Error("Missing refresh token");

    const payload = await import("../utils/auth.server").then(m => m.verifyRefreshToken(refreshTokenRaw));
    if (!payload) throw new Error("Invalid token signature");

    const [storedToken] = await db.select().from(refreshTokens).where(eq(refreshTokens.familyId, payload.familyId));

    if (!storedToken) {
      throw new Error("Invalid token (Not found)");
    }

    if (storedToken.revoked) {
      throw new Error("Token reuse detected! Access revoked.");
    }

    if (!await comparePassword(refreshTokenRaw, storedToken.hashedToken)) {
      await db.update(refreshTokens).set({ revoked: true }).where(eq(refreshTokens.familyId, payload.familyId));
      throw new Error("Token reuse detected! Access revoked.");
    }
    const newAccessToken = generateAccessToken(payload.userId);
    const newRefreshToken = generateRefreshToken(payload.userId, payload.familyId);

    await db.update(refreshTokens).set({
      hashedToken: await hashPassword(newRefreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }).where(eq(refreshTokens.id, storedToken.id));

    return createAuthCookies(newAccessToken, newRefreshToken);
  }

  static async logout(refreshTokenRaw?: string) {
    if (refreshTokenRaw) {
      const payload = await import("../utils/auth.server").then(m => m.verifyRefreshToken(refreshTokenRaw));
      if (payload) {
        await db.delete(refreshTokens).where(eq(refreshTokens.familyId, payload.familyId));
      }
    }
    return import("../utils/auth.server").then(m => m.clearAuthCookies());
  }

  static async getAuthenticatedUser(request: Request) {
    const cookieHeader = request.headers.get("Cookie");
    if (!cookieHeader) return null;

    const { accessToken, refreshToken } = await import("../utils/auth.server").then(m => m.parse(cookieHeader));

    if (accessToken) {
      const payload = await import("../utils/auth.server").then(m => m.verifyAccessToken(accessToken));
      if (payload) {
        const [user] = await db.select().from(users).where(eq(users.id, payload.userId));
        return user || null;
      }
    }

    if (refreshToken) {
      try {
        const newCookies = await this.refresh(refreshToken);
        throw redirect(request.url, { headers: newCookies });
      } catch (error) {
        return null;
      }
    }

    return null;
  }

  static async requireAuthenticatedUser(request: Request) {
    const user = await this.getAuthenticatedUser(request);
    if (!user) {
      throw redirect(ROUTES.LOGIN);
    }
    return user;
  }
  static async requireAnonymous(request: Request) {
    const user = await this.getAuthenticatedUser(request);
    if (user) {
      throw redirect(ROUTES.DASHBOARD);
    }
    return true;
  }
}
