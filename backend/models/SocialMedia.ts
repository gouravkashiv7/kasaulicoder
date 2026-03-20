import mongoose, { Schema, Document } from "mongoose";

export interface ISocialMedia extends Document {
  platform: string;
  username: string;
  password: string;
  managedBy: mongoose.Types.ObjectId;
  platformUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SocialMediaSchema: Schema = new Schema(
  {
    platform: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    managedBy: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    platformUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.SocialMedia ||
  mongoose.model<ISocialMedia>("SocialMedia", SocialMediaSchema);
