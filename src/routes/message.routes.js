// import { Router } from "express";
// import { requireAdmin } from "../middleware/auth.js";
// import {
//   createMessage,
//   listMessages,
//   toggleRead,
//   deleteMessage,
// } from "../controllers/message.controller.js";

// const router = Router();

// // public
// router.post("/", createMessage);

// // admin
// router.get("/", requireAdmin, listMessages);
// router.patch("/:id/toggle-read", requireAdmin, toggleRead);
// router.delete("/:id", requireAdmin, deleteMessage);

// export default router;

// import { Router } from "express";
// import { createMessage, markRead } from "../controllers/message.controller.js";
// import { requireAdmin } from "../middleware/auth.js";

// const router = Router();

// // public
// router.post("/", createMessage);

// // admin
// router.patch("/:id/read", requireAdmin, markRead);

// export default router;


import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import {
  createMessage,
  listMessages,
  toggleRead,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = Router();

// PUBLIC
router.post("/", createMessage);

// ADMIN
router.get("/", requireAdmin, listMessages);
router.patch("/:id/toggle-read", requireAdmin, toggleRead);
router.delete("/:id", requireAdmin, deleteMessage);

export default router;

