export function toPublicUrl(req, filePath) {
  if (!filePath) return null;

  // If already absolute, return as-is
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  const base = `${req.protocol}://${req.get("host")}`;
  return `${base}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
}