import {
  connectToDatabase,
  ContactMessageModel,
  type ContactMessageStatus,
} from "@/lib/db";

/**
 * Contact inbox service.
 *
 * Public visitors create messages via POST /api/contact. Staff list, read,
 * and delete them from /admin/contact.
 */

export interface ContactMessageView {
  id: string;
  name: string;
  email: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  message: string;
}

type LeanContactMessage = {
  _id: unknown;
  name: string;
  email: string;
  message: string;
  status: ContactMessageStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

function toView(doc: LeanContactMessage): ContactMessageView {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    message: doc.message,
    status: doc.status,
    createdAt: doc.createdAt?.toISOString() ?? new Date(0).toISOString(),
    updatedAt: doc.updatedAt?.toISOString() ?? new Date(0).toISOString(),
  };
}

function isObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export async function createContactMessage(
  input: ContactMessageInput
): Promise<ContactMessageView> {
  await connectToDatabase();
  const doc = await ContactMessageModel.create({
    name: input.name,
    email: input.email,
    message: input.message,
    status: "new",
  });
  const lean = await ContactMessageModel.findById(doc._id).lean<LeanContactMessage | null>();
  if (!lean) throw new Error("Contact message could not be read back after creation.");
  return toView(lean);
}

export async function listContactMessages(): Promise<ContactMessageView[]> {
  await connectToDatabase();
  const docs = await ContactMessageModel.find()
    .sort({ createdAt: -1 })
    .lean<LeanContactMessage[]>();
  return docs.map(toView);
}

export async function countNewContactMessages(): Promise<number> {
  await connectToDatabase();
  return ContactMessageModel.countDocuments({ status: "new" });
}

export async function getContactMessageById(
  id: string
): Promise<ContactMessageView | null> {
  if (!isObjectId(id)) return null;
  await connectToDatabase();
  const doc = await ContactMessageModel.findById(id).lean<LeanContactMessage | null>();
  return doc ? toView(doc) : null;
}

export async function updateContactMessageStatus(
  id: string,
  status: ContactMessageStatus
): Promise<ContactMessageView | null> {
  if (!isObjectId(id)) return null;
  await connectToDatabase();
  const doc = await ContactMessageModel.findByIdAndUpdate(
    id,
    { $set: { status } },
    { returnDocument: "after", runValidators: true }
  ).lean<LeanContactMessage | null>();
  return doc ? toView(doc) : null;
}

export async function deleteContactMessage(
  id: string
): Promise<ContactMessageView | null> {
  if (!isObjectId(id)) return null;
  await connectToDatabase();
  const doc = await ContactMessageModel.findById(id).lean<LeanContactMessage | null>();
  if (!doc) return null;
  await ContactMessageModel.deleteOne({ _id: doc._id });
  return toView(doc);
}
