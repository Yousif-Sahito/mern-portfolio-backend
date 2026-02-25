import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { projectUpload } from "../middleware/upload.js";
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

export default function projectRoutes(io) {
  const router = Router();

  // public
  router.get("/", listProjects);
  router.get("/:id", getProject);

  // admin
  router.post("/", requireAdmin, projectUpload, createProject(io));
  router.put("/:id", requireAdmin, projectUpload, updateProject(io));
  router.delete("/:id", requireAdmin, deleteProject(io));

  return router;
}
