// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import Admin from "../models/Admin.js";
// import { asyncHandler } from "../utils/asyncHandler.js";

// function signToken(admin) {
//   return jwt.sign(
//     { id: admin._id.toString(), email: admin.email },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
//   );
// }

// export const login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const admin = await Admin.findOne({ email: email.toLowerCase() });
//   if (!admin) return res.status(401).json({ error: "Invalid credentials" });

//   const ok = await bcrypt.compare(password, admin.passwordHash);
//   if (!ok) return res.status(401).json({ error: "Invalid credentials" });

//   const token = signToken(admin);

//   res.json({
//     token,
//     admin: { email: admin.email },
//   });
// });

// // Optional - only for dev/test (you can remove in production)
// export const register = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const exists = await Admin.findOne({ email: email.toLowerCase() });
//   if (exists) return res.status(409).json({ error: "Admin already exists" });

//   const passwordHash = await bcrypt.hash(password, 12);
//   const admin = await Admin.create({ email: email.toLowerCase(), passwordHash });

//   res.status(201).json({ admin: { email: admin.email } });
// });

// export const me = asyncHandler(async (req, res) => {
//   res.json({ admin: req.admin });
// });

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ================= TOKEN ================= */
function signToken(admin) {
  return jwt.sign(
    { id: admin._id.toString(), email: admin.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
}

/* ================= LOGIN ================= */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const admin = await Admin.findOne({
    email: email.toLowerCase(),
  });

  if (!admin)
    return res.status(401).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, admin.passwordHash);

  if (!isMatch)
    return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken(admin);

  res.json({
    token,
    admin: {
      email: admin.email,
    },
  });
});

/* ================= REGISTER (DEV ONLY) ================= */
export const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email & password required" });

  const exists = await Admin.findOne({
    email: email.toLowerCase(),
  });

  if (exists)
    return res.status(409).json({ error: "Admin already exists" });

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await Admin.create({
    email: email.toLowerCase(),
    passwordHash,
  });

  res.status(201).json({
    admin: { email: admin.email },
  });
});

/* ================= ME ================= */
export const me = asyncHandler(async (req, res) => {
  res.json({
    admin: req.admin,
  });
});