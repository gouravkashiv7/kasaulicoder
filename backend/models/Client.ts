import mongoose, { type Document, Schema, type Types } from "mongoose";

export interface IClient extends Document {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  // The director who manages this client's payments
  managedBy?: Types.ObjectId | null;
  isActive: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    notes: { type: String },
    managedBy: { type: Schema.Types.ObjectId, ref: "Staff" },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
  },
  { timestamps: true },
);

// Prevent model recompilation in Next.js
export default mongoose.models.Client ||
  mongoose.model<IClient>("Client", ClientSchema);
