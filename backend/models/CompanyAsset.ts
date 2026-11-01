import mongoose, { type Document, Schema, type Types } from "mongoose";
import { type SoftDeletable, softDeleteFields } from "@/backend/lib/softDelete";

export const ASSET_KINDS = [
  "domain",
  "software",
  "hardware",
  "account",
  "other",
] as const;
export const COST_PERIODS = ["one-time", "monthly", "yearly"] as const;

// Things the company owns: domain names first, then software, hardware and
// accounts. Never holds passwords or keys; notes may say where they are kept.
export interface ICompanyAsset extends Document, SoftDeletable {
  kind: (typeof ASSET_KINDS)[number];
  // A domain's name is the normalised domain itself, such as example.com
  name: string;
  registrar?: string;
  expiresOn?: Date;
  autoRenew: boolean;
  costPaise?: number;
  costPeriod: (typeof COST_PERIODS)[number];
  purchasedOn?: Date;
  notes?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CompanyAssetSchema: Schema = new Schema(
  {
    kind: { type: String, enum: ASSET_KINDS, required: true },
    name: { type: String, required: true, trim: true },
    registrar: { type: String, trim: true },
    expiresOn: { type: Date },
    autoRenew: { type: Boolean, default: false },
    costPaise: { type: Number },
    costPeriod: { type: String, enum: COST_PERIODS, default: "yearly" },
    purchasedOn: { type: Date },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    ...softDeleteFields,
  },
  { timestamps: true },
);

// Prevent model recompilation in Next.js
export default mongoose.models.CompanyAsset ||
  mongoose.model<ICompanyAsset>("CompanyAsset", CompanyAssetSchema);
