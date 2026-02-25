import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../src/models/Admin.js";

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.log("Usage: node scripts/seedAdmin.js admin@email.com password123");
    process.exit(1);
  }

  const exists = await Admin.findOne({ email: email.toLowerCase() });
  if (exists) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ email: email.toLowerCase(), passwordHash });

  console.log("✅ Admin created:", email);
  process.exit(0);
}

run();
