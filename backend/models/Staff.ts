import mongoose, { Schema, Document } from "mongoose";

export interface IStaff extends Document {
  name: string;
  email: string;
  password?: string;
  role: "superadmin" | "admin" | "editor" | "support";
  designation?: string;
  roleDescription?: string;
  image?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "admin", "editor", "support"],
      default: "admin",
    },
    designation: { type: String },
    roleDescription: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true },
);

// Prevent model recompilation in Next.js
export default mongoose.models.Staff ||
  mongoose.model<IStaff>("Staff", StaffSchema);
