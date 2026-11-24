import mongoose, { type Document, Schema } from "mongoose";

export interface IStaff extends Document {
  name: string;
  email: string;
  password?: string;
  role: "superadmin" | "admin" | "editor" | "support";
  designation?: string;
  roleDescription?: string;
  website?: string;
  image?: string;
  isActive: boolean;
  isDirector: boolean;
  lastLogin?: Date;
  passwordChangedAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["superadmin", "admin", "editor", "support"],
      default: "admin",
    },
    designation: { type: String },
    roleDescription: { type: String },
    // Personal site, linked from the public team card
    website: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    isDirector: { type: Boolean, default: false },
    lastLogin: { type: Date },
    // Sessions issued before this moment are rejected
    passwordChangedAt: { type: Date },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true },
);

// Prevent model recompilation in Next.js
export default mongoose.models.Staff ||
  mongoose.model<IStaff>("Staff", StaffSchema);
