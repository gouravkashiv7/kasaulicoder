import mongoose, { Schema, Document } from "mongoose";

export interface IPlan extends Document {
  name: string;
  description: string;
  price: number;
  currency: string;
  billingType: "one_time" | "recurring";
  billingCycle?: "monthly" | "yearly"; // only for recurring
  features: string[];
  targetAudience: "student" | "professional" | "both";
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    billingType: {
      type: String,
      enum: ["one_time", "recurring"],
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      default: null,
    },
    features: [{ type: String }],
    targetAudience: {
      type: String,
      enum: ["student", "professional", "both"],
      default: "both",
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.models.Plan ||
  mongoose.model<IPlan>("Plan", PlanSchema);
