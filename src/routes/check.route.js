import express from "express";
import Check from "../models/check.js";

const router = express.Router();

// save test data
router.post("/check", async (req, res) => {
  try {
    const doc = await Check.create({
      title: "DB Test",
      status: "saved successfully",
    });

    res.json({
      success: true,
      data: doc,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
