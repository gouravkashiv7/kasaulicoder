import mongoose, { type Document, Schema, type Types } from "mongoose";

export interface IPolicyVote {
  staff: Types.ObjectId;
  vote: "yes" | "no";
  comment?: string;
  at: Date;
}

export interface IPolicy extends Document {
  title: string;
  body: string;
  kind: "general" | "revenue-split";
  // Basis points (1% = 100); company plus directors always total 10000.
  split?: {
    companyBps: number;
    directors: Array<{ staff: Types.ObjectId; bps: number }>;
  };
  proposedBy: Types.ObjectId;
  votes: IPolicyVote[];
  status: "proposed" | "approved" | "rejected" | "superseded";
  decidedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VoteSchema = new Schema(
  {
    staff: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    vote: { type: String, enum: ["yes", "no"], required: true },
    comment: { type: String },
    at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const PolicySchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    kind: {
      type: String,
      enum: ["general", "revenue-split"],
      default: "general",
    },
    split: {
      companyBps: { type: Number },
      directors: [
        {
          _id: false,
          staff: { type: Schema.Types.ObjectId, ref: "Staff" },
          bps: { type: Number },
        },
      ],
    },
    proposedBy: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    votes: { type: [VoteSchema], default: [] },
    status: {
      type: String,
      enum: ["proposed", "approved", "rejected", "superseded"],
      default: "proposed",
    },
    decidedAt: { type: Date },
  },
  { timestamps: true },
);

// Prevent model recompilation in Next.js
export default mongoose.models.Policy ||
  mongoose.model<IPolicy>("Policy", PolicySchema);
