import mongoose, { type Document, Schema, type Types } from "mongoose";
import { type SoftDeletable, softDeleteFields } from "@/backend/lib/softDelete";

export interface IExpense extends Document, SoftDeletable {
  purpose: string;
  amountPaise: number;
  attachment: Types.ObjectId;
  requestedBy: Types.ObjectId;
  approvals: Array<{
    staff: Types.ObjectId;
    decision: "approve" | "reject";
    comment?: string;
    at: Date;
  }>;
  status: "pending" | "approved" | "rejected" | "released";
  release?: {
    by: Types.ObjectId;
    at: Date;
    reference?: string;
    attachment?: Types.ObjectId;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    purpose: { type: String, required: true, trim: true },
    amountPaise: { type: Number, required: true },
    attachment: {
      type: Schema.Types.ObjectId,
      ref: "Attachment",
      required: true,
    },
    requestedBy: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    approvals: [
      {
        _id: false,
        staff: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
        decision: {
          type: String,
          enum: ["approve", "reject"],
          required: true,
        },
        comment: { type: String },
        at: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "released"],
      default: "pending",
    },
    release: {
      by: { type: Schema.Types.ObjectId, ref: "Staff" },
      at: { type: Date },
      reference: { type: String, trim: true },
      attachment: { type: Schema.Types.ObjectId, ref: "Attachment" },
    },
    ...softDeleteFields,
  },
  { timestamps: true },
);

// Prevent model recompilation in Next.js
export default mongoose.models.Expense ||
  mongoose.model<IExpense>("Expense", ExpenseSchema);
