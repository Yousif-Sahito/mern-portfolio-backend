import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    details: { type: String, required: true },

    techStack: [{ type: String, trim: true }],

    thumbnailUrl: { type: String, required: true },
    images: [{ type: String }],

    liveDemoUrl: { type: String },
    githubUrl: { type: String },

    codeFileUrl: { type: String } // zip/rar file
  },
  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);
