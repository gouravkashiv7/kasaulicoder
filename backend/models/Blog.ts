import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  mainImageUrl: string;
  tagline: string;
  description: string;
  content: string;
  authorId: string;
  writtenBy: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    mainImageUrl: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    writtenBy: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  { timestamps: true },
);

// In Next.js, we need to handle the case where the model is already in
// the Mongoose cache but with an old schema.
if (mongoose.models.Blog) {
  // Check if our new field 'authorId' exists in the existing model's schema
  if (!mongoose.models.Blog.schema.paths.authorId) {
    delete mongoose.models.Blog;
  }
}

export default mongoose.models.Blog ||
  mongoose.model<IBlog>("Blog", BlogSchema);
