import mongoose, { type Document, Schema, type Types } from "mongoose";
import { type SoftDeletable, softDeleteFields } from "@/backend/lib/softDelete";

export interface IContributionShare {
  staff: Types.ObjectId;
  paise: number;
  status: "pending" | "confirmed";
  // The proof the director uploaded when confirming their part
  proof?: Types.ObjectId;
  confirmedAt?: Date;
}

// Directors putting money into the company in equal shares. The split is
// snapshotted when it starts. It only counts toward the company balance once
// every director has confirmed their part with a proof.
export interface IContribution extends Document, SoftDeletable {
  // Total paise funded
  totalPaise: number;
  note?: string;
  createdBy: Types.ObjectId;
  fundedBy?: Types.ObjectId;
  fundedByName?: string;
  proof?: Types.ObjectId;
  shares?: IContributionShare[];
  status: "pending" | "completed" | "cancelled" | "approved" | "rejected";
  completedAt?: Date;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  cancelReason?: string;
  cancelledBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContributionSchema: Schema = new Schema(
  {
    totalPaise: { type: Number, required: true },
    note: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    fundedBy: { type: Schema.Types.ObjectId, ref: "Staff" },
    fundedByName: { type: String, trim: true },
    proof: { type: Schema.Types.ObjectId, ref: "Attachment" },
    shares: [
      {
        _id: false,
        staff: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
        paise: { type: Number, required: true },
        status: {
          type: String,
          enum: ["pending", "confirmed"],
          default: "pending",
        },
        proof: { type: Schema.Types.ObjectId, ref: "Attachment" },
        confirmedAt: { type: Date },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled", "approved", "rejected"],
      default: "pending",
    },
    completedAt: { type: Date },
    approvedBy: { type: Schema.Types.ObjectId, ref: "Staff" },
    approvedAt: { type: Date },
    cancelReason: { type: String },
    cancelledBy: { type: Schema.Types.ObjectId, ref: "Staff" },
    ...softDeleteFields,
  },
  { timestamps: true },
);

// Prevent model recompilation in Next.js
export default mongoose.models.Contribution ||
  mongoose.model<IContribution>("Contribution", ContributionSchema);
