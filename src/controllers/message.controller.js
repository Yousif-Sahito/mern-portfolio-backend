// import Message from "../models/Message.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import nodemailer from "nodemailer";

// async function maybeEmailAdmin({ name, email, message }) {
//   if (!process.env.SMTP_HOST || !process.env.ADMIN_NOTIFY_EMAIL) return;

//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT || 587),
//     secure: false,
//     auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
//   });

//   await transporter.sendMail({
//     from: process.env.SMTP_USER,
//     to: process.env.ADMIN_NOTIFY_EMAIL,
//     subject: `New Portfolio Message from ${name}`,
//     text: `From: ${name} <${email}>\n\n${message}`,
//   });
// }

// export const createMessage = asyncHandler(async (req, res) => {
//   const { name, email, message } = req.body;

//   const doc = await Message.create({ name, email, message });

//   // Optional email notify
//   try {
//     await maybeEmailAdmin({ name, email, message });
//   } catch (e) {
//     // don't block request if email fails
//     console.warn("⚠️ Email notify failed:", e?.message);
//   }

//   res.status(201).json(doc);
// });

// export const listMessages = asyncHandler(async (req, res) => {
//   const msgs = await Message.find().sort({ createdAt: -1 });
//   res.json(msgs);
// });

// export const toggleRead = asyncHandler(async (req, res) => {
//   const msg = await Message.findById(req.params.id);
//   if (!msg) return res.status(404).json({ error: "Not found" });
//   msg.isRead = !msg.isRead;
//   await msg.save();
//   res.json(msg);
// });

// export const deleteMessage = asyncHandler(async (req, res) => {
//   await Message.findByIdAndDelete(req.params.id);
//   res.json({ ok: true });
// });






// // running
// import Message from "../models/Message.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { emitToVisitor } from "../socket/index.js";

// // Public: send message
// export const createMessage = asyncHandler(async (req, res) => {
//   const { name, email, message, visitorId } = req.body;

//   if (!visitorId) {
//     return res.status(400).json({ error: "visitorId is required" });
//   }

//   const doc = await Message.create({
//     name,
//     email,
//     message,
//     visitorId,
//     status: "sent",
//   });

//   // return messageId so user can track it in UI
//   res.status(201).json({ ok: true, id: doc._id, status: doc.status });
// });

// // Admin: mark read
// export const markRead = asyncHandler(async (req, res) => {
//   const msg = await Message.findById(req.params.id);
//   if (!msg) return res.status(404).json({ error: "Not found" });

//   msg.status = "read";
//   msg.readAt = new Date();
//   await msg.save();

//   // ✅ realtime: notify only that visitor
//   emitToVisitor(msg.visitorId, "message:read", {
//     id: String(msg._id),
//     status: msg.status,
//     readAt: msg.readAt,
//   });

//   res.json({ ok: true, id: msg._id, status: msg.status, readAt: msg.readAt });
// });

import Message from "../models/Message.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { makeTransporter } from "../utils/mailer.js";
import { env } from "../config/env.js";

// PUBLIC: anyone can send message
export const createMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const saved = await Message.create({
    name,
    email,
    message,
    read: false,
  });

  // Email to owner (Reply-To sender)
  try {
    const transporter = makeTransporter();
    await transporter.sendMail({
      from: `"Portfolio Contact" <${env.SMTP_USER}>`,
      to: env.OWNER_EMAIL,
      replyTo: email,
      subject: `New Message from ${name} (Portfolio)`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nMessage ID: ${saved._id}`,
      html: `
        <h2>New Portfolio Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br/>${String(message).replace(/\n/g, "<br/>")}</p>
        <hr/>
        <p><b>Message ID:</b> ${saved._id}</p>
        <p><i>Reply to this email to respond to the sender.</i></p>
      `,
    });
  } catch (err) {
    console.error("❌ Email send failed:", err);
  }

  res.status(201).json(saved);
});

// ADMIN: list messages
export const listMessages = asyncHandler(async (req, res) => {
  const msgs = await Message.find().sort({ createdAt: -1 });
  res.json(msgs);
});

// ADMIN: toggle read/unread
export const toggleRead = asyncHandler(async (req, res) => {
  const msg = await Message.findById(req.params.id);
  if (!msg) return res.status(404).json({ error: "Message not found" });

  msg.read = !msg.read;
  await msg.save();

  res.json(msg);
});

// ✅ ADMIN: delete message (this is what your error is about)
export const deleteMessage = asyncHandler(async (req, res) => {
  const msg = await Message.findByIdAndDelete(req.params.id);
  if (!msg) return res.status(404).json({ error: "Message not found" });

  res.json({ ok: true });
});
