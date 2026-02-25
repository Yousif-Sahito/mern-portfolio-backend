import Project from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emitProjectEvent } from "../socket/index.js";
import { toPublicUrl } from "../utils/file.js";

// ✅ Put helper at top
const parseTechStack = (value) => {
  if (!value) return [];

  // If frontend sends JSON string like: ["React","Node"]
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {}

  // If frontend sends comma-separated string like: React, Node, MongoDB
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

export const listProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

export const getProject = asyncHandler(async (req, res) => {
  const p = await Project.findById(req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

// ✅ create project
export const createProject = (io) =>
  asyncHandler(async (req, res) => {
    const { title, description, details, techStack, liveDemoUrl, githubUrl } =
      req.body;

    const thumbnail = req.files?.thumbnail?.[0];
    if (!thumbnail) return res.status(400).json({ error: "Thumbnail required" });

    const images = (req.files?.images || []).map((f) => toPublicUrl(req, f.path));
    const codeFile = req.files?.codeFile?.[0];

    const project = await Project.create({
      title,
      description,
      details,
      techStack: parseTechStack(techStack), // ✅ FIXED
      thumbnailUrl: toPublicUrl(req, thumbnail.path),
      images,
      liveDemoUrl: liveDemoUrl || "",
      githubUrl: githubUrl || "",
      codeFileUrl: codeFile ? toPublicUrl(req, codeFile.path) : "",
    });

    emitProjectEvent(io, "projectCreated", project);
    res.status(201).json(project);
  });

// ✅ update project
export const updateProject = (io) =>
  asyncHandler(async (req, res) => {
    const existing = await Project.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });

    const { title, description, details, techStack, liveDemoUrl, githubUrl } =
      req.body;

    const thumbnail = req.files?.thumbnail?.[0];
    const images = (req.files?.images || []).map((f) => toPublicUrl(req, f.path));
    const codeFile = req.files?.codeFile?.[0];

    if (title !== undefined) existing.title = title;
    if (description !== undefined) existing.description = description;
    if (details !== undefined) existing.details = details;
    if (liveDemoUrl !== undefined) existing.liveDemoUrl = liveDemoUrl;
    if (githubUrl !== undefined) existing.githubUrl = githubUrl;

    // ✅ FIXED: accept both JSON or comma-separated
    if (techStack !== undefined) existing.techStack = parseTechStack(techStack);

    if (thumbnail) existing.thumbnailUrl = toPublicUrl(req, thumbnail.path);
    if (images.length) existing.images = images;
    if (codeFile) existing.codeFileUrl = toPublicUrl(req, codeFile.path);

    await existing.save();

    emitProjectEvent(io, "projectUpdated", existing);
    res.json(existing);
  });

export const deleteProject = (io) =>
  asyncHandler(async (req, res) => {
    const p = await Project.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ error: "Not found" });

    emitProjectEvent(io, "projectDeleted", { id: req.params.id });
    res.json({ ok: true });
  });
