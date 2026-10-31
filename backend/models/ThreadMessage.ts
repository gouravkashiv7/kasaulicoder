import mongoose, { type Document, Schema, type Types } from "mongoose";

export interface IThreadMessage extends Document {
  thread: Types.ObjectId;
  author: Types.ObjectId;
  body: string;
  // Each time this message was emailed to other directors
  emails: Array<{
    to: string[];
    subject: string;
    sentBy: Types.ObjectId;
    at: Date;
  }>;
  createdAt: Date;
}

const ThreadMessageSchema: Schema = new Schema(
  {
    thread: {
      type: Schema.Types.ObjectId,
      ref: "Thread",
      required: true,
      index: true,
    },
    author: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    body: { type: String, required: true },
    emails: [
      {
        _id: false,
        to: [String],
        subject: String,
        sentBy: { type: Schema.Types.ObjectId, ref: "Staff" },
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Prevent model recompilation in Next.js
export default mongoose.models.ThreadMessage ||
  mongoose.model<IThreadMessage>("ThreadMessage", ThreadMessageSchema);
