import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  blogId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    userId: { type: Schema.Types.ObjectId, required: true }, // Can reference User or Staff depending on who comments
    userName: { type: String, required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // Defaulting to approved for now, can be changed to pending if moderation is needed
    },
  },
  { timestamps: true },
);

export default mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema);
