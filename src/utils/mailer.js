import nodemailer from "nodemailer";
import { env } from "../config/env.js";

export function makeTransporter() {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: false, // ✅ for 587
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS, // ✅ app password
    },
  });
}
