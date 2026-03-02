import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "user" },
  },
  { timestamps: true },
);

// Prevent model recompilation in Next.js
export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
