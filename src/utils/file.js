// export function toPublicUrl(req, filepath) {
//   const normalized = filepath.replace(/\\/g, "/");
//   return `${req.protocol}://${req.get("host")}/${normalized}`;
// }

import path from "path";

const normalize = (p) => p.replaceAll("\\", "/");

export const toPublicUrl = (req, filePath) => {
  if (!filePath) return "";

  const normalized = normalize(filePath);

  // Ensure we extract from /uploads
  const idx = normalized.indexOf("/uploads");
  const publicPath =
    idx >= 0 ? normalized.slice(idx) : `/${normalized}`;

  const base = process.env.BASE_URL?.replace(/\/$/, "");

  if (base) {
    return `${base}${publicPath.startsWith("/") ? "" : "/"}${publicPath}`;
  }

  // fallback (force https)
  const host = req.get("host");
  return `https://${host}${publicPath}`;
};