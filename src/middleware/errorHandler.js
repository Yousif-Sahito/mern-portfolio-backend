export function errorHandler(err, req, res, next) {
  console.error("❌ API Error:", err);

  // Hide internal errors from users
  return res.status(500).json({
    error: "Server error",
  });
}
