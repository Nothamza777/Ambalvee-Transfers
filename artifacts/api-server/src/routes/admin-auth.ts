import {
  createHash,
  createHmac,
  randomInt,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";
import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import {
  adminStoreStateTable,
  db,
} from "@workspace/db";
import {
  GetAdminCaptchaResponse,
  GetAdminSessionResponse,
  GetAdminStoreStateResponse,
  GetStorefrontStateResponse,
  LoginAdminBody,
  LoginAdminResponse,
  LogoutAdminResponse,
  SaveAdminStoreStateBody,
  SaveAdminStoreStateResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const sessionCookieName = "ninja_admin_session";
const sessionMaxAgeMs = 8 * 60 * 60 * 1000;
const captchaLifetimeMs = 3 * 60 * 1000;
const attemptWindowMs = 15 * 60 * 1000;
const maxLoginAttempts = 5;
const challengeIssueLimit = 25;
const challengeIssueWindowMs = 15 * 60 * 1000;
const maxTrackedIps = 5000;
const maxOutstandingChallenges = 25000;
const captchaAlphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const storeStateId = "ninja-transfers";
const publicStoreKeys = ["products", "websiteSettings", "menuHeaders", "videos"] as const;
const persistedStoreKeys = [
  "websiteSettings",
  "products",
  "orders",
  "customers",
  "coupons",
  "stockMovements",
  "auditLogs",
  "menuHeaders",
  "videos",
  "loginEvents",
] as const;

interface CaptchaChallenge {
  answer: string;
  expiresAt: number;
  ip: string;
}

interface RateBucket {
  count: number;
  resetAt: number;
}

interface AdminSessionPayload {
  email: string;
  expiresAt: number;
}

const challenges = new Map<string, CaptchaChallenge>();
const failedLogins = new Map<string, RateBucket>();
const challengeRequests = new Map<string, RateBucket>();

const clientIp = (request: Request) =>
  request.ip || request.socket.remoteAddress || "unknown";

const pruneExpiredState = (now: number) => {
  for (const [id, challenge] of challenges) {
    if (challenge.expiresAt <= now) challenges.delete(id);
  }
  for (const [ip, bucket] of failedLogins) {
    if (bucket.resetAt <= now) failedLogins.delete(ip);
  }
  for (const [ip, bucket] of challengeRequests) {
    if (bucket.resetAt <= now) challengeRequests.delete(ip);
  }
};

const consumeRateLimit = (
  buckets: Map<string, RateBucket>,
  key: string,
  now: number,
  limit: number,
  windowMs: number,
) => {
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    if (!bucket && buckets.size >= maxTrackedIps) {
      return { allowed: false, retryAfterSeconds: 60 };
    }
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }
  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  bucket.count += 1;
  return {
    allowed: true,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
};

const configuredCredentials = () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  if (!email || !password || !secret) return null;
  return { email, password, secret };
};

const sameText = (provided: string, expected: string) => {
  const providedDigest = createHash("sha256").update(provided).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(providedDigest, expectedDigest);
};

const signSession = (payload: AdminSessionPayload, secret: string) => {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
};

const verifySession = (
  token: unknown,
  secret: string,
  expectedEmail: string,
): AdminSessionPayload | null => {
  if (typeof token !== "string") return null;
  const [encoded, signature, extra] = token.split(".");
  if (!encoded || !signature || extra) return null;

  const expectedSignature = createHmac("sha256", secret).update(encoded).digest();
  const suppliedSignature = Buffer.from(signature, "base64url");
  if (
    suppliedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(suppliedSignature, expectedSignature)
  ) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as Partial<AdminSessionPayload>;
    if (
      payload.email !== expectedEmail ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= Date.now()
    ) return null;
    return { email: payload.email, expiresAt: payload.expiresAt };
  } catch {
    return null;
  }
};

const getSession = (request: Request): AdminSessionPayload | null => {
  const credentials = configuredCredentials();
  if (!credentials) return null;
  return verifySession(
    request.cookies?.[sessionCookieName],
    credentials.secret,
    credentials.email,
  );
};

const requestHasSameOrigin = (request: Request) => {
  const origin = request.get("origin");
  const host = request.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).origin === `${request.protocol}://${host}`;
  } catch {
    return false;
  }
};

const captchaImage = (answer: string) => {
  const text = [...answer].map((character, index) =>
    `<text x="${24 + index * 27}" y="${48 + (index % 2) * 4}" transform="rotate(${randomInt(-12, 13)} ${24 + index * 27} 40)">${character}</text>`
  ).join("");
  const lines = Array.from({ length: 7 }, () => {
    const x1 = randomInt(0, 205);
    const y1 = randomInt(4, 72);
    const x2 = randomInt(0, 205);
    const y2 = randomInt(4, 72);
    return `<path d="M${x1} ${y1} L${x2} ${y2}"/>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="210" height="76" viewBox="0 0 210 76" role="img"><rect width="210" height="76" rx="12" fill="#f5f0e8"/><g stroke="#6e786e" stroke-opacity=".48" stroke-width="1.3">${lines}</g><g fill="#252b29" font-family="monospace" font-size="29" font-weight="700" letter-spacing="2">${text}</g></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};

const setSessionCookie = (
  request: Request,
  response: Response,
  value: string,
) => {
  response.cookie(sessionCookieName, value, {
    httpOnly: true,
    secure: request.secure || process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: sessionMaxAgeMs,
  });
};

router.get("/admin/captcha", (req, res) => {
  const now = Date.now();
  pruneExpiredState(now);
  const ip = clientIp(req);
  const issueLimit = consumeRateLimit(
    challengeRequests,
    ip,
    now,
    challengeIssueLimit,
    challengeIssueWindowMs,
  );
  res.setHeader("Cache-Control", "no-store");
  if (!issueLimit.allowed) {
    res.setHeader("Retry-After", String(issueLimit.retryAfterSeconds));
    res.status(429).json({ message: "Please wait before requesting another challenge." });
    return;
  }
  if (challenges.size >= maxOutstandingChallenges) {
    res.setHeader("Retry-After", "60");
    res.status(429).json({ message: "Too many outstanding challenges. Please wait and retry." });
    return;
  }

  const answer = Array.from(
    { length: 6 },
    () => captchaAlphabet[randomInt(0, captchaAlphabet.length)],
  ).join("");
  const id = randomUUID();
  challenges.set(id, { answer, expiresAt: now + captchaLifetimeMs, ip });
  res.json(GetAdminCaptchaResponse.parse({
    id,
    imageDataUrl: captchaImage(answer),
    expiresInSeconds: Math.floor(captchaLifetimeMs / 1000),
  }));
});

router.get("/admin/session", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const payload = getSession(req);
  res.json(GetAdminSessionResponse.parse({
    authenticated: Boolean(payload),
    ...(payload ? { email: payload.email } : {}),
  }));
});

router.post("/admin/login", (req, res): void => {
  res.setHeader("Cache-Control", "no-store");
  if (!requestHasSameOrigin(req)) {
    res.status(403).json({ authenticated: false, message: "Request origin was not accepted." });
    return;
  }

  const now = Date.now();
  pruneExpiredState(now);
  const ip = clientIp(req);
  const currentLimit = failedLogins.get(ip);
  if (currentLimit && currentLimit.count >= maxLoginAttempts && currentLimit.resetAt > now) {
    const retryAfterSeconds = Math.max(1, Math.ceil((currentLimit.resetAt - now) / 1000));
    res.setHeader("Retry-After", String(retryAfterSeconds));
    res.status(429).json(LoginAdminResponse.parse({
      authenticated: false,
      message: "Too many attempts. Please wait before trying again.",
      retryAfterSeconds,
    }));
    return;
  }

  const parsed = LoginAdminBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ authenticated: false, message: "Enter your credentials and complete the CAPTCHA." });
    return;
  }

  const input = parsed.data;
  if (
    input.email.length > 320 ||
    input.password.length > 512 ||
    input.captchaId.length > 64 ||
    input.captchaAnswer.length !== 6
  ) {
    res.status(400).json({ authenticated: false, message: "Enter valid credentials and complete the CAPTCHA." });
    return;
  }
  const challenge = challenges.get(input.captchaId);
  challenges.delete(input.captchaId);
  const captchaValid = Boolean(
    challenge &&
    challenge.expiresAt > now &&
    challenge.ip === ip &&
    sameText(input.captchaAnswer.trim().toUpperCase(), challenge.answer)
  );

  const credentials = configuredCredentials();
  if (!credentials) {
    res.status(503).json(LoginAdminResponse.parse({
      authenticated: false,
      message: "Admin access is not configured. Add ADMIN_EMAIL and ADMIN_PASSWORD in project Secrets.",
    }));
    return;
  }

  const credentialsValid =
    sameText(input.email.trim().toLowerCase(), credentials.email) &&
    sameText(input.password, credentials.password);
  if (!captchaValid || !credentialsValid) {
    const limit = consumeRateLimit(failedLogins, ip, now, maxLoginAttempts, attemptWindowMs);
    if (!limit.allowed || failedLogins.get(ip)?.count === maxLoginAttempts) {
      const retryAfterSeconds = limit.retryAfterSeconds;
      res.setHeader("Retry-After", String(retryAfterSeconds));
      res.status(429).json(LoginAdminResponse.parse({
        authenticated: false,
        message: "Too many attempts. Please wait before trying again.",
        retryAfterSeconds,
      }));
      return;
    }
    res.status(401).json(LoginAdminResponse.parse({
      authenticated: false,
      message: "Sign-in details or CAPTCHA were not accepted.",
      retryAfterSeconds: limit.retryAfterSeconds,
    }));
    return;
  }

  failedLogins.delete(ip);
  setSessionCookie(
    req,
    res,
    signSession({ email: credentials.email, expiresAt: now + sessionMaxAgeMs }, credentials.secret),
  );
  res.setHeader("Cache-Control", "no-store");
  res.json(LoginAdminResponse.parse({ authenticated: true, email: credentials.email }));
});

router.post("/admin/logout", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!requestHasSameOrigin(req)) {
    res.status(403).json({ authenticated: false, message: "Request origin was not accepted." });
    return;
  }
  res.clearCookie(sessionCookieName, {
    httpOnly: true,
    secure: req.secure || process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  res.json(LogoutAdminResponse.parse({ authenticated: false }));
});

router.get("/admin/store-state", async (req, res): Promise<void> => {
  if (!getSession(req)) {
    res.status(401).json({ message: "Administrator sign-in required." });
    return;
  }
  res.setHeader("Cache-Control", "no-store");
  try {
    const [record] = await db
      .select()
      .from(adminStoreStateTable)
      .where(eq(adminStoreStateTable.id, storeStateId))
      .limit(1);
    res.json(GetAdminStoreStateResponse.parse({
      data: record?.data ?? {},
      updatedAt: record?.updatedAt?.toISOString() ?? null,
    }));
  } catch (error) {
    req.log.error({ err: error }, "Failed to read admin store state");
    res.status(500).json({ message: "Store data could not be loaded." });
  }
});

router.put("/admin/store-state", async (req, res): Promise<void> => {
  if (!requestHasSameOrigin(req)) {
    res.status(403).json({ message: "Request origin was not accepted." });
    return;
  }
  if (!getSession(req)) {
    res.status(401).json({ message: "Administrator sign-in required." });
    return;
  }
  const parsed = SaveAdminStoreStateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "The store state payload was not valid." });
    return;
  }

  const data = Object.fromEntries(
    persistedStoreKeys.flatMap((key) =>
      Object.prototype.hasOwnProperty.call(parsed.data.data, key)
        ? [[key, parsed.data.data[key]]]
        : [],
    ),
  );
  try {
    const [record] = await db
      .insert(adminStoreStateTable)
      .values({ id: storeStateId, data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: adminStoreStateTable.id,
        set: { data, updatedAt: new Date() },
      })
      .returning();
    res.json(SaveAdminStoreStateResponse.parse({
      data: record.data,
      updatedAt: record.updatedAt.toISOString(),
    }));
  } catch (error) {
    req.log.error({ err: error }, "Failed to save admin store state");
    res.status(500).json({ message: "Store data could not be saved." });
  }
});

router.get("/storefront", async (req, res): Promise<void> => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const [record] = await db
      .select()
      .from(adminStoreStateTable)
      .where(eq(adminStoreStateTable.id, storeStateId))
      .limit(1);
    const data = record?.data ?? {};
    const publicData = Object.fromEntries(
      publicStoreKeys.flatMap((key) =>
        Object.prototype.hasOwnProperty.call(data, key) ? [[key, data[key]]] : [],
      ),
    );
    res.json(GetStorefrontStateResponse.parse({
      data: publicData,
      updatedAt: record?.updatedAt?.toISOString() ?? null,
    }));
  } catch (error) {
    req.log.error({ err: error }, "Failed to read public storefront state");
    res.status(500).json({ message: "Storefront content could not be loaded." });
  }
});

export default router;
