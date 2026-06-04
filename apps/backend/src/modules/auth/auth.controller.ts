import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { sendSuccess } from "../../utils/send.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { HttpError } from "../../utils/http-error.js";
import { deriveClientPassword, hashPassword, normaliseDomain, verifyPassword } from "./password.js";
import { signToken } from "./token.js";
import { sendMail } from "../../utils/mailer.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";

// In-memory OTP store (email → { otp, expires }). 10-minute TTL.
const otpStore = new Map<string, { otp: string; expires: number }>();

const TOKEN_TYPE = "Bearer";

const publicAccount = (account: {
  id: string;
  name: string;
  email: string;
  company: string;
  domain: string;
  mobile: string;
  dob: Date;
}) => ({
  id: account.id,
  name: account.name,
  email: account.email,
  company: account.company,
  domain: account.domain,
  mobile: account.mobile,
  dob: account.dob.toISOString().slice(0, 10)
});

/**
 * Register a client account.
 * The portal password is DERIVED from the domain + date of birth
 * (first 4 letters of the domain + DDMMYYYY) and returned ONCE so the
 * client can note it down for future logins.
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as RegisterInput;
  const domain = normaliseDomain(body.domain);
  const mobile = body.mobile.replace(/[\s-]/g, "");

  const existing = await prisma.clientAccount.findFirst({
    where: { OR: [{ email: body.email }, { domain }] }
  });
  if (existing) {
    const field = existing.email === body.email ? "email" : "domain";
    throw new HttpError(409, `An account for this ${field} already exists. Please sign in instead.`);
  }

  const password = deriveClientPassword(domain, body.dob);
  const passwordHash = await hashPassword(password);

  const account = await prisma.clientAccount.create({
    data: {
      name: body.name,
      email: body.email,
      company: body.company,
      domain,
      mobile,
      dob: new Date(`${body.dob}T00:00:00.000Z`),
      passwordHash,
      lastLoginAt: new Date()
    }
  });

  const token = signToken({ sub: account.id, email: account.email, domain: account.domain });

  console.log(`[auth] account registered: ${account.email} (${account.domain})`);

  sendSuccess(
    res,
    {
      token,
      tokenType: TOKEN_TYPE,
      account: publicAccount(account),
      // Returned only once, at registration, so the client can save it.
      password
    },
    {
      message: "Account created. Your portal password has been generated — save it for future logins.",
      status: 201
    }
  );
});

/** Sign in with email-or-domain + the derived password. */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as LoginInput;
  const identifier = body.identifier.trim().toLowerCase();
  const domain = normaliseDomain(identifier);

  const account = await prisma.clientAccount.findFirst({
    where: { OR: [{ email: identifier }, { domain }] }
  });

  // Generic message to avoid leaking which accounts exist.
  const invalid = new HttpError(401, "Invalid credentials. Check your email/domain and password.");
  if (!account) throw invalid;

  const ok = await verifyPassword(body.password, account.passwordHash);
  if (!ok) throw invalid;

  await prisma.clientAccount.update({
    where: { id: account.id },
    data: { lastLoginAt: new Date() }
  });

  const token = signToken({ sub: account.id, email: account.email, domain: account.domain });

  console.log(`[auth] login: ${account.email} (${account.domain})`);

  sendSuccess(res, {
    token,
    tokenType: TOKEN_TYPE,
    account: publicAccount(account)
  });
});

/** Step 1: verify identity (email + domain + dob) and email a 6-digit OTP. */
export const forgotRequest = asyncHandler(async (req: Request, res: Response) => {
  const { email, domain, dob } = req.body as { email: string; domain: string; dob: string };

  // If the email isn't on file at all, tell the user they're not registered.
  const byEmail = await prisma.clientAccount.findFirst({ where: { email } });
  if (!byEmail) {
    throw new HttpError(404, "This email is not registered. Please contact us to get onboarded.");
  }

  // Email exists — the domain and date of birth must also match.
  const detailsMatch =
    byEmail.domain === normaliseDomain(domain) && byEmail.dob.toISOString().slice(0, 10) === dob;
  if (!detailsMatch) {
    throw new HttpError(400, "The domain or date of birth doesn't match our records.");
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });
  await sendMail(
    email,
    "Your NextGen Ventures password reset code",
    `Your verification code is ${otp}. It expires in 10 minutes.`
  );

  sendSuccess(res, { sent: true }, { message: "A verification code has been emailed to you." });
});

/** Step 2: verify the OTP and email the account's password to the client. */
export const forgotVerify = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body as { email: string; otp: string };
  const entry = otpStore.get(email);
  if (!entry || entry.expires < Date.now() || entry.otp !== otp) {
    throw new HttpError(400, "Invalid or expired verification code.");
  }
  otpStore.delete(email);

  const account = await prisma.clientAccount.findFirst({ where: { email } });
  if (!account || !account.password) {
    throw new HttpError(404, "No password on file. Please contact us to reset your access.");
  }

  await sendMail(email, "Your NextGen Ventures portal password", `Your portal password is: ${account.password}`);
  sendSuccess(res, { password: account.password }, { message: "Verified. Your password has been sent to your email." });
});

/** Return the currently authenticated account (from a valid bearer token). */
export const me = asyncHandler(async (req: Request, res: Response) => {
  const accountId = req.account?.sub;
  if (!accountId) throw new HttpError(401, "Authentication required.");

  const account = await prisma.clientAccount.findUnique({ where: { id: accountId } });
  if (!account) throw new HttpError(401, "Account no longer exists.");

  sendSuccess(res, { account: publicAccount(account) });
});
