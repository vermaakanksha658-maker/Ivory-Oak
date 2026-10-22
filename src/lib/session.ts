import { jwtVerify } from "jose";

export const SESSION_COOKIE = "ivory_oak_session";
export const SESSION_MAX_AGE = 60 * 60 * 8;

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
};

const developmentSecret =
  "ivory-oak-development-secret-change-before-production-2026";

export function sessionKey(): Uint8Array | null {
  const secret =
    process.env.AUTH_SECRET ??
    (process.env.NODE_ENV !== "production" ? developmentSecret : undefined);

  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  const key = sessionKey();
  if (!key) return null;

  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    return null;
  }
}
