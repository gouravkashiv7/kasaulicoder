import mongoose, { type Document, Schema, type Types } from "mongoose";

export interface IThread extends Document {
  title: string;
  createdBy: Types.ObjectId;
  lastMessageAt: Date;
  // Staff id -> when that director last opened the thread
  readBy: Map<string, Date>;
  createdAt: Date;
  updatedAt: Date;
}

const ThreadSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    lastMessageAt: { type: Date, default: Date.now },
    readBy: { type: Map, of: Date, default: {} },
  },
  { timestamps: true },
);

// Prevent model recompilation in Next.js
export default mongoose.models.Thread ||
  mongoose.model<IThread>("Thread", ThreadSchema);
