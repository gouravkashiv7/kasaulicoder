import { Schema, type Types } from "mongoose";

// Records a superadmin deletes are kept but hidden: they get a deletedAt stamp
// instead of being removed. A missing field counts as not deleted, so records
// created before this existed need no migration.
export interface SoftDeletable {
  deletedAt?: Date | null;
  deletedBy?: Types.ObjectId | null;
}

export const softDeleteFields = {
  deletedAt: { type: Date },
  deletedBy: { type: Schema.Types.ObjectId, ref: "Staff" },
};

// Spread into a query filter to leave out deleted records.
export const NOT_DELETED = { deletedAt: null } as const;
