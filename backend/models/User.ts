import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "user";
  userType: "student" | "professional";
  pic?: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user"], default: "user" },
    userType: {
      type: String,
      enum: ["student", "professional"],
      default: "student",
    },
    pic: { type: String },
    emailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Prevent model recompilation in Next.js
export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
