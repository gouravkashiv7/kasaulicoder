import mongoose, { type Document, Schema, type Types } from "mongoose";
import { type SoftDeletable, softDeleteFields } from "@/backend/lib/softDelete";

export interface IPayment extends Document, SoftDeletable {
  client: Types.ObjectId;
  amountPaise: number;
  receivedOn: Date;
  reference?: string;
  note?: string;
  attachment?: Types.ObjectId;
  recordedBy: Types.ObjectId;
  // Snapshot of the split in force when the payment was recorded
  allocation: {
    policy: Types.ObjectId;
    companyPaise: number;
    shares: Array<{ staff: Types.ObjectId; paise: number }>;
    outsourced?: { name: string; paise: number };
  };
  status: "recorded" | "void";
  voidReason?: string;
  voidedBy?: Types.ObjectId;
  voidedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    amountPaise: { type: Number, required: true },
    receivedOn: { type: Date, required: true },
    reference: { type: String, trim: true },
    note: { type: String },
    attachment: { type: Schema.Types.ObjectId, ref: "Attachment" },
    recordedBy: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    allocation: {
      policy: { type: Schema.Types.ObjectId, ref: "Policy", required: true },
      companyPaise: { type: Number, required: true },
      shares: [
        {
          _id: false,
          staff: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
          paise: { type: Number, required: true },
        },
      ],
      outsourced: {
        name: { type: String },
        paise: { type: Number },
      },
    },
    status: { type: String, enum: ["recorded", "void"], default: "recorded" },
    voidReason: { type: String },
    voidedBy: { type: Schema.Types.ObjectId, ref: "Staff" },
    voidedAt: { type: Date },
    ...softDeleteFields,
  },
  { timestamps: true },
);

// Prevent model recompilation in Next.js
export default mongoose.models.Payment ||
  mongoose.model<IPayment>("Payment", PaymentSchema);
