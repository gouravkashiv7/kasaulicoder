import mongoose, { type Document, Schema, type Types } from "mongoose";

// Payment and expense screenshots. Kept out of the finance documents so list
// queries never drag image bytes along.
export interface IAttachment extends Document {
  data: Buffer;
  mime: string;
  size: number;
  uploadedBy: Types.ObjectId;
  createdAt: Date;
}

const AttachmentSchema: Schema = new Schema(
  {
    data: { type: Buffer, required: true },
    mime: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Prevent model recompilation in Next.js
export default mongoose.models.Attachment ||
  mongoose.model<IAttachment>("Attachment", AttachmentSchema);
