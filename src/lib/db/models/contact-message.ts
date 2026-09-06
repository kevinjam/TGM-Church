import { Schema, model, models, type Model } from "mongoose";
import {
  CONTACT_MESSAGE_STATUSES,
  type ContactMessageStatus,
} from "@/lib/db/constants";
import { schemaJsonOptions } from "@/lib/db/schema-helpers";

/**
 * A message submitted from the public /contact form.
 * Staff review these in the admin inbox; they are not public content.
 */
export interface ContactMessageDoc {
  name: string;
  email: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: Date;
  updatedAt: Date;
  id?: string;
}

const ContactMessageSchema = new Schema<ContactMessageDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: [...CONTACT_MESSAGE_STATUSES],
      default: "new",
    },
  },
  schemaJsonOptions<ContactMessageDoc>()
);

ContactMessageSchema.index({ status: 1, createdAt: -1 });
ContactMessageSchema.index({ createdAt: -1 });

export const ContactMessageModel: Model<ContactMessageDoc> =
  (models.ContactMessage as Model<ContactMessageDoc> | undefined) ??
  model<ContactMessageDoc>("ContactMessage", ContactMessageSchema, "contact_messages");
