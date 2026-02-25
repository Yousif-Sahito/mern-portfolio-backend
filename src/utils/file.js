export function toPublicUrl(req, filepath) {
  const normalized = filepath.replace(/\\/g, "/");
  return `${req.protocol}://${req.get("host")}/${normalized}`;
}
