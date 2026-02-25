import multer from "multer";
import path from "path";
import fs from "fs";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/projects";

    if (file.fieldname === "thumbnail") folder = "uploads/thumbnails";
    if (file.fieldname === "images") folder = "uploads/projects";
    if (file.fieldname === "codeFile") folder = "uploads/code";
    if (file.fieldname === "cv") folder = "uploads/cv";

    ensureDir(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${Math.random().toString(16).slice(2)}-${safe}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // ✅ 100MB limit (zip can be big)
  },
});

export const projectUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 10 },
  { name: "codeFile", maxCount: 1 },
]);
