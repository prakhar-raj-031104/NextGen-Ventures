import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined
    })
  : null;

export const sendMail = async (to: string, subject: string, text: string): Promise<void> => {
  if (!transporter) {
    // No SMTP configured — log so the flow still works in development.
    console.log(`[mail:dev] to=${to} | ${subject}\n${text}`);
    return;
  }
  await transporter.sendMail({ from: env.SMTP_FROM ?? env.SMTP_USER, to, subject, text });
};
