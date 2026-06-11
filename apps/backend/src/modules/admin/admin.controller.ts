import { timingSafeEqual } from "crypto";
import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";
import { sendSuccess } from "../../utils/send.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { HttpError } from "../../utils/http-error.js";
import { signAdminToken } from "../auth/token.js";
import { deriveClientPassword, hashPassword, normaliseDomain } from "../auth/password.js";
import type { CreateClientInput, CreatePaymentInput } from "./admin.schema.js";

const safeEqual = (a: string, b: string): boolean => {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
};

/** Owner login — single shared password, returns a short-lived admin token. */
export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { password } = req.body as { password: string };
  if (!safeEqual(password, env.ADMIN_PASSWORD)) {
    throw new HttpError(401, "Incorrect password.");
  }
  const token = signAdminToken();
  sendSuccess(res, { token, tokenType: "Bearer" }, { message: "Signed in to the control panel." });
});

/** Dashboard overview — totals, status breakdowns, and recent activity. */
export const overview = asyncHandler(async (_req: Request, res: Response) => {
  const [
    ticketTotal,
    leadTotal,
    internshipTotal,
    clientTotal,
    inquiryTotal,
    ticketsByStatus,
    leadsByStatus,
    internshipsByStatus,
    newInquiries,
    recentTickets,
    recentLeads
  ] = await Promise.all([
    prisma.clientTicket.count(),
    prisma.lead.count(),
    prisma.internshipApplication.count(),
    prisma.clientAccount.count(),
    prisma.serviceInquiry.count(),
    prisma.clientTicket.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.internshipApplication.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.serviceInquiry.count({ where: { status: "NEW" } }),
    prisma.clientTicket.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 6 })
  ]);

  const toMap = (rows: { status: string; _count: { _all: number } }[]) =>
    rows.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.status]: r._count._all }), {});

  // "Open work" = tickets that still need attention.
  const openTickets = ticketsByStatus
    .filter((r) => r.status !== "RESOLVED" && r.status !== "CLOSED")
    .reduce((sum, r) => sum + r._count._all, 0);

  const newLeads = leadsByStatus
    .filter((r) => r.status === "NEW")
    .reduce((sum, r) => sum + r._count._all, 0);

  sendSuccess(res, {
    totals: {
      tickets: ticketTotal,
      leads: leadTotal,
      internships: internshipTotal,
      clients: clientTotal,
      inquiries: inquiryTotal,
      openTickets,
      newLeads,
      newInquiries
    },
    ticketsByStatus: toMap(ticketsByStatus),
    leadsByStatus: toMap(leadsByStatus),
    internshipsByStatus: toMap(internshipsByStatus),
    recentTickets,
    recentLeads
  });
});

/* ── Service inquiries (add-on / quote requests) ──────────────────────────── */
export const listInquiries = asyncHandler(async (_req: Request, res: Response) => {
  const inquiries = await prisma.serviceInquiry.findMany({ orderBy: { createdAt: "desc" } });
  sendSuccess(res, inquiries);
});

export const updateInquiryStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: string };
  const inquiry = await prisma.serviceInquiry
    .update({ where: { id }, data: { status: status as never } })
    .catch(() => null);
  if (!inquiry) throw new HttpError(404, "Inquiry not found.");
  sendSuccess(res, inquiry, { message: `Quote request marked ${status}.` });
});

/* ── Tickets ──────────────────────────────────────────────────────────────── */
export const listTickets = asyncHandler(async (_req: Request, res: Response) => {
  const tickets = await prisma.clientTicket.findMany({ orderBy: { createdAt: "desc" } });
  sendSuccess(res, tickets);
});

export const updateTicketStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: string };
  const ticket = await prisma.clientTicket
    .update({ where: { id }, data: { status: status as never } })
    .catch(() => null);
  if (!ticket) throw new HttpError(404, "Ticket not found.");
  sendSuccess(res, ticket, { message: `Ticket ${ticket.ticketNumber} marked ${status}.` });
});

/* ── Leads / contact enquiries ────────────────────────────────────────────── */
export const listLeads = asyncHandler(async (_req: Request, res: Response) => {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  sendSuccess(res, leads);
});

export const updateLeadStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: string };
  const lead = await prisma.lead
    .update({ where: { id }, data: { status: status as never } })
    .catch(() => null);
  if (!lead) throw new HttpError(404, "Enquiry not found.");
  sendSuccess(res, lead, { message: `Enquiry marked ${status}.` });
});

/* ── Internship applications ──────────────────────────────────────────────── */
export const listInternships = asyncHandler(async (_req: Request, res: Response) => {
  const apps = await prisma.internshipApplication.findMany({ orderBy: { createdAt: "desc" } });
  sendSuccess(res, apps);
});

export const updateInternshipStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: string };
  const app = await prisma.internshipApplication
    .update({ where: { id }, data: { status: status as never } })
    .catch(() => null);
  if (!app) throw new HttpError(404, "Application not found.");
  sendSuccess(res, app, { message: `Application marked ${status}.` });
});

/* ── Client accounts ──────────────────────────────────────────────────────── */
export const listClients = asyncHandler(async (_req: Request, res: Response) => {
  const clients = await prisma.clientAccount.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, company: true, domain: true,
      mobile: true, dob: true, password: true, lastLoginAt: true, createdAt: true,
      _count: { select: { tickets: true } }
    }
  });
  sendSuccess(res, clients);
});

/** Create a client account from the panel — derives & returns the password once. */
export const createClient = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreateClientInput;
  const domain = normaliseDomain(body.domain);
  const mobile = body.mobile.replace(/[\s-]/g, "");

  const existing = await prisma.clientAccount.findFirst({
    where: { OR: [{ email: body.email }, { domain }] }
  });
  if (existing) {
    const field = existing.email === body.email ? "email" : "domain";
    throw new HttpError(409, `A client with this ${field} already exists.`);
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
      password,
      passwordHash
    }
  });

  sendSuccess(
    res,
    {
      account: {
        id: account.id, name: account.name, email: account.email,
        company: account.company, domain: account.domain, mobile: account.mobile
      },
      password
    },
    { message: `Client ${account.company} created. Share the generated password securely.`, status: 201 }
  );
});

/* ── Payments ─────────────────────────────────────────────────────────────── */
export const listPayments = asyncHandler(async (_req: Request, res: Response) => {
  const payments = await prisma.payment.findMany({
    orderBy: { paidAt: "desc" },
    include: { account: { select: { company: true, domain: true, email: true } } }
  });
  sendSuccess(res, payments);
});

/** Record a payment against a client account (shown in their portal). */
export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreatePaymentInput;

  const account = await prisma.clientAccount.findUnique({ where: { id: body.accountId } });
  if (!account) throw new HttpError(404, "Client account not found.");

  const payment = await prisma.payment.create({
    data: {
      accountId:   body.accountId,
      amount:      body.amount,
      description: body.description,
      invoiceNo:   body.invoiceNo || null,
      method:      body.method || null,
      status:      (body.status ?? "PAID") as never,
      paidAt:      body.paidAt ? new Date(`${body.paidAt}T00:00:00.000Z`) : new Date()
    },
    include: { account: { select: { company: true, domain: true, email: true } } }
  });

  sendSuccess(res, payment, { message: `Payment recorded for ${account.company}.`, status: 201 });
});
