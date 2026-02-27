// export function toPublicUrl(req, filepath) {
//   const normalized = filepath.replace(/\\/g, "/");
//   return `${req.protocol}://${req.get("host")}/${normalized}`;
// }


// server/src/utils/file.js
import path from "path";

// Convert windows paths to URL paths
const normalize = (p) => p.replaceAll("\\", "/");

/**
 * Returns absolute public URL for a stored file.
 * Priority:
 *  1) process.env.BASE_URL  (recommended for production)
 *  2) req protocol+host (fallback; forced to https)
 */
export const toPublicUrl = (req, filePath) => {
  if (!filePath) return "";

  // Only keep part after "/uploads"
  const idx = normalize(filePath).indexOf("/uploads");
  const publicPath = idx >= 0 ? normalize(filePath).slice(idx) : normalize(filePath);

  // ✅ BEST: Use BASE_URL if available
  const baseFromEnv = process.env.BASE_URL?.replace(/\/$/, "");
  if (baseFromEnv) return `${baseFromEnv}${publicPath}`;

  // Fallback: use request host but FORCE https (important for Render/Vercel)
  const host = req.get("host");
  const proto = "https"; // force https always
  return `${proto}://${host}${publicPath}`;
};