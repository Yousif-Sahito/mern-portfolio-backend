import mongoose from "mongoose";

const checkSchema = new mongoose.Schema(
  {
    title: String,
    status: String,
  },
  { timestamps: true }
);

export default mongoose.model("Check", checkSchema);
