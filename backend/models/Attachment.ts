import mongoose, { type Document, Schema, type Types } from "mongoose";

// Payment, expense and contribution proofs (PNG, JPG or PDF). A proof is first
// staged here with its bytes in `data`. When a record uses it, the file moves
// to Cloudinary (`storage: "cloudinary"`) and `data` is removed. Rows without
// `storage` predate Cloudinary and still hold their bytes. Kept out of the
// finance documents so list queries never drag file bytes along.
export interface IAttachment extends Document {
  data?: Buffer;
  mime: string;
  size: number;
  uploadedBy: Types.ObjectId;
  storage?: "db" | "cloudinary";
  publicId?: string;
  version?: number;
  format?: string;
  sha256?: string;
  linked: boolean;
  linkedTo?: { kind: string; id: Types.ObjectId };
  createdAt: Date;
}

const AttachmentSchema: Schema = new Schema(
  {
    data: { type: Buffer },
    mime: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    storage: { type: String, enum: ["db", "cloudinary"] },
    publicId: { type: String },
    version: { type: Number },
    format: { type: String },
    sha256: { type: String },
    linked: { type: Boolean, default: false },
    linkedTo: {
      kind: { type: String },
      id: { type: Schema.Types.ObjectId },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// One proof can only ever be used once: its hash is unique.
AttachmentSchema.index(
  { sha256: 1 },
  { unique: true, partialFilterExpression: { sha256: { $type: "string" } } },
);
// Uploads no record ever used are cleaned up after a day. Rows from before
// `linked` existed don't match the filter, so they are never removed.
AttachmentSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 24 * 60 * 60,
    partialFilterExpression: { linked: false },
  },
);

// Prevent model recompilation in Next.js
export default mongoose.models.Attachment ||
  mongoose.model<IAttachment>("Attachment", AttachmentSchema);
