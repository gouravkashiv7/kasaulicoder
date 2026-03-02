import mongoose, { Schema, Document } from "mongoose";

export interface IContactRequest extends Document {
  name: string;
  email: string;
  userType: "student" | "professional";
  query: string;
  isRead: boolean;
  ipAddress: string;
  device: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactRequestSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    userType: {
      type: String,
      enum: ["student", "professional"],
      required: true,
    },
    query: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    ipAddress: { type: String, default: "unknown" },
    device: { type: String, default: "unknown" },
  },
  { timestamps: true },
);

// Prevent model recompilation in Next.js
export default mongoose.models.ContactRequest ||
  mongoose.model<IContactRequest>("ContactRequest", ContactRequestSchema);
