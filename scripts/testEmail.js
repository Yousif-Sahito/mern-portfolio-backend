import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function main() {
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_PORT:", process.env.SMTP_PORT);

  // verify login
  await transporter.verify();
  console.log("✅ SMTP login OK");

  const info = await transporter.sendMail({
    from: `"Portfolio Test" <${process.env.SMTP_USER}>`,
    to: process.env.OWNER_EMAIL || process.env.SMTP_USER,
    subject: "✅ Test email from portfolio server",
    text: "If you received this, Nodemailer is working.",
  });

  console.log("✅ Sent:", info.messageId);
}

main().catch((e) => {
  console.error("❌ Email test failed:", e);
  process.exit(1);
});
