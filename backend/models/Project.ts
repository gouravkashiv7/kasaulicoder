import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  outcome: string;
  desc: string;
  media: { type: "image" | "video"; url: string }[];
  tags: string[];
  content?: string;
  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  status: "active" | "past";
  featured: boolean;
  members: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    outcome: { type: String, required: true },
    desc: { type: String, required: true },
    media: [
      {
        type: { type: String, enum: ["image", "video"], required: true },
        url: { type: String, required: true },
      },
    ],
    tags: { type: [String], default: [] },
    content: { type: String },
    githubUrl: { type: String },
    liveUrl: { type: String },
    videoUrl: { type: String },
    status: {
      type: String,
      enum: ["active", "past"],
      default: "active",
    },
    featured: { type: Boolean, default: false },
    members: [{ type: Schema.Types.ObjectId, ref: "Staff", default: [] }],
  },
  { timestamps: true },
);

// Prevent model recompilation in Next.js
export default mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);
