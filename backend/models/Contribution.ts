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
  // What the directors pay together: an equal share each, so it always divides
  totalPaise: number;
  note?: string;
  createdBy: Types.ObjectId;
  shares: IContributionShare[];
  status: "pending" | "completed" | "cancelled";
  completedAt?: Date;
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
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    completedAt: { type: Date },
    cancelReason: { type: String },
    cancelledBy: { type: Schema.Types.ObjectId, ref: "Staff" },
    ...softDeleteFields,
  },
  { timestamps: true },
);

// Prevent model recompilation in Next.js
export default mongoose.models.Contribution ||
  mongoose.model<IContribution>("Contribution", ContributionSchema);
