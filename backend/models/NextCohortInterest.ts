import mongoose, { Schema, Document } from "mongoose";

export interface INextCohortInterest extends Document {
  email: string;
  emailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NextCohortInterestSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Prevent model recompilation in Next.js
export default mongoose.models.NextCohortInterest ||
  mongoose.model<INextCohortInterest>(
    "NextCohortInterest",
    NextCohortInterestSchema,
  );
