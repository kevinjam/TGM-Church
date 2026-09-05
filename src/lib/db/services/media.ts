import { connectToDatabase, MediaModel, type MediaAssetDoc } from "@/lib/db";

export interface MediaView {
  id: string;
  url: string;
  filename: string;
  alt: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
}

function toMediaView(doc: {
  _id: unknown;
  url: string;
  filename: string;
  alt?: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
  createdAt?: Date;
}): MediaView {
  return {
    id: String(doc._id),
    url: doc.url,
    filename: doc.filename,
    alt: doc.alt ?? "",
    mimeType: doc.mimeType ?? "",
    size: doc.size ?? 0,
    width: doc.width,
    height: doc.height,
    createdAt: doc.createdAt?.toISOString() ?? new Date(0).toISOString(),
  };
}

export async function listMedia(): Promise<MediaView[]> {
  await connectToDatabase();
  const docs = await MediaModel.find().sort({ createdAt: -1 }).lean();
  return docs.map(toMediaView);
}

export async function createMediaEntry(input: {
  url: string;
  filename: string;
  alt?: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
}): Promise<MediaView> {
  await connectToDatabase();
  const doc = await MediaModel.create(input);
  const lean = await MediaModel.findById(doc._id).lean();
  if (!lean) throw new Error("Media entry could not be read back after creation.");
  return toMediaView(lean as MediaAssetDoc & { _id: unknown });
}

export async function removeMediaEntry(id: string): Promise<MediaView | null> {
  await connectToDatabase();
  const doc = await MediaModel.findById(id).lean();
  if (!doc) return null;
  await MediaModel.deleteOne({ _id: doc._id });
  return toMediaView(doc as MediaAssetDoc & { _id: unknown });
}
