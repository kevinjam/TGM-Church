import {
  connectToDatabase,
  EventModel,
  type ContentStatus,
  type EventCategory,
} from "@/lib/db";
import { parseLocalDate, toIsoDate } from "@/lib/dates";

/**
 * Events collection service.
 *
 * Defaults reproduce src/data/events.ts so the public /events page looks
 * identical before staff add or edit anything.
 */

export interface EventView {
  id: string;
  title: string;
  description: string;
  /** Calendar date as YYYY-MM-DD (timezone-safe for admin date inputs). */
  date: string;
  time: string;
  location: string;
  image: string;
  category: EventCategory;
  isUpcoming: boolean;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EventInput {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: EventCategory;
  isUpcoming: boolean;
  status: ContentStatus;
}

export const DEFAULT_EVENTS: EventInput[] = [
  {
    title: "Sunday Service",
    description:
      "Join us for our weekly Sunday worship service. We gather to praise God, hear His word, and fellowship together.",
    date: "2024-01-21",
    time: "10:00 AM",
    location: "TGM Church, Wakiso Nakawuka",
    image: "/images/event-sunday.jpg",
    category: "Worship",
    isUpcoming: true,
    status: "published",
  },
  {
    title: "Youth Conference 2024",
    description:
      "A powerful conference for young people to grow in their faith and connect with God and each other.",
    date: "2024-02-15",
    time: "9:00 AM - 5:00 PM",
    location: "TGM Church, Wakiso Nakawuka",
    image: "/images/event-youth.jpg",
    category: "Special",
    isUpcoming: true,
    status: "published",
  },
  {
    title: "Community Outreach",
    description:
      "Join us as we reach out to our community with love, hope, and practical assistance.",
    date: "2024-01-28",
    time: "8:00 AM - 2:00 PM",
    location: "Nakawuka Community Center",
    image: "/images/event-outreach.jpg",
    category: "Outreach",
    isUpcoming: true,
    status: "published",
  },
  {
    title: "Bible Study - Book of Romans",
    description:
      "Deep dive into the Book of Romans with Pastor John. All are welcome to join this enriching study.",
    date: "2024-01-17",
    time: "7:00 PM",
    location: "TGM Church, Wakiso Nakawuka",
    image: "/images/event-bible-study.jpg",
    category: "Training",
    isUpcoming: true,
    status: "published",
  },
  {
    title: "New Year Service",
    description:
      "Celebrating the new year with thanksgiving and prayer for God's blessings in 2024.",
    date: "2024-01-01",
    time: "10:00 AM",
    location: "TGM Church, Wakiso Nakawuka",
    image: "/images/event-new-year.jpg",
    category: "Special",
    isUpcoming: false,
    status: "published",
  },
];

type LeanEvent = {
  _id: unknown;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  image?: string;
  category: EventCategory;
  isUpcoming: boolean;
  status: ContentStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

function toEventView(doc: LeanEvent): EventView {
  const date = doc.date instanceof Date ? doc.date : new Date(doc.date);
  return {
    id: String(doc._id),
    title: doc.title,
    description: doc.description,
    date: toIsoDate(date),
    time: doc.time,
    location: doc.location,
    image: doc.image ?? "",
    category: doc.category,
    isUpcoming: doc.isUpcoming,
    status: doc.status,
    createdAt: doc.createdAt?.toISOString() ?? new Date(0).toISOString(),
    updatedAt: doc.updatedAt?.toISOString() ?? new Date(0).toISOString(),
  };
}

async function ensureDefaultEvents(): Promise<void> {
  const count = await EventModel.countDocuments();
  if (count > 0) return;

  await EventModel.insertMany(
    DEFAULT_EVENTS.map((event) => ({
      title: event.title,
      description: event.description,
      date: parseLocalDate(event.date),
      time: event.time,
      location: event.location,
      image: event.image,
      category: event.category,
      isUpcoming: event.isUpcoming,
      status: event.status,
    }))
  );
}

export async function listEvents(): Promise<EventView[]> {
  await connectToDatabase();
  await ensureDefaultEvents();
  const docs = await EventModel.find()
    .sort({ isUpcoming: -1, date: -1 })
    .lean<LeanEvent[]>();
  return docs.map(toEventView);
}

export async function getPublishedEvents(): Promise<EventView[]> {
  try {
    await connectToDatabase();
    await ensureDefaultEvents();
    const docs = await EventModel.find({ status: "published" })
      .sort({ isUpcoming: -1, date: 1 })
      .lean<LeanEvent[]>();
    return docs.map(toEventView);
  } catch (error) {
    console.warn(
      "Published events unavailable — rendering seeded defaults.",
      error instanceof Error ? error.message : error
    );
    return DEFAULT_EVENTS.map((event, index) => ({
      ...event,
      id: `default-${index + 1}`,
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    }));
  }
}

function isObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export async function getEventById(id: string): Promise<EventView | null> {
  if (!isObjectId(id)) return null;
  await connectToDatabase();
  const doc = await EventModel.findById(id).lean<LeanEvent | null>();
  return doc ? toEventView(doc) : null;
}

export async function createEvent(input: EventInput): Promise<EventView> {
  await connectToDatabase();
  const doc = await EventModel.create({
    title: input.title,
    description: input.description,
    date: parseLocalDate(input.date),
    time: input.time,
    location: input.location,
    image: input.image,
    category: input.category,
    isUpcoming: input.isUpcoming,
    status: input.status,
  });
  const lean = await EventModel.findById(doc._id).lean<LeanEvent | null>();
  if (!lean) throw new Error("Event could not be read back after creation.");
  return toEventView(lean);
}

export async function updateEvent(
  id: string,
  input: EventInput
): Promise<EventView | null> {
  if (!isObjectId(id)) return null;
  await connectToDatabase();
  const doc = await EventModel.findByIdAndUpdate(
    id,
    {
      $set: {
        title: input.title,
        description: input.description,
        date: parseLocalDate(input.date),
        time: input.time,
        location: input.location,
        image: input.image,
        category: input.category,
        isUpcoming: input.isUpcoming,
        status: input.status,
      },
    },
    { returnDocument: "after", runValidators: true }
  ).lean<LeanEvent | null>();
  return doc ? toEventView(doc) : null;
}

export async function deleteEvent(id: string): Promise<EventView | null> {
  if (!isObjectId(id)) return null;
  await connectToDatabase();
  const doc = await EventModel.findById(id).lean<LeanEvent | null>();
  if (!doc) return null;
  await EventModel.deleteOne({ _id: doc._id });
  return toEventView(doc);
}
