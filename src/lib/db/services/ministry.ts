import {
  connectToDatabase,
  MinistryModel,
  type ContentStatus,
  type MinistryIconKey,
} from "@/lib/db";

/**
 * Ministries collection service.
 *
 * Defaults reproduce src/data/ministries.ts so the public /ministries page
 * looks identical before staff add or edit anything.
 */

export interface MinistryView {
  id: string;
  name: string;
  description: string;
  cta: string;
  image: string;
  icon: MinistryIconKey | "";
  order: number;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MinistryInput {
  name: string;
  description: string;
  cta: string;
  image: string;
  icon: MinistryIconKey | "";
  order: number;
  status: ContentStatus;
}

export const DEFAULT_MINISTRIES: MinistryInput[] = [
  {
    name: "Youth of Grace (YOG) Ministry",
    description:
      "Empowering young people to live boldly for Christ! Our Youth Ministry creates dynamic spaces where teens encounter God's grace through worship, relevant teaching, and authentic community. We equip youth to transform their schools, homes, and communities with confidence.",
    cta: "",
    image: "",
    icon: "youth",
    order: 1,
    status: "published",
  },
  {
    name: "Men of Grace (MOG) Ministry",
    description:
      "Building strong Christian men who lead with integrity! Through small groups, mentorship, and outdoor adventures, we challenge brothers to grow spiritually and fight for purity. Whether navigating fatherhood, career, or personal struggles, this is your tribe.",
    cta: "",
    image: "",
    icon: "men",
    order: 2,
    status: "published",
  },
  {
    name: "Women of Grace (WOG) Ministry",
    description:
      "A safe sisterhood where women discover their God-given design! Through Bible studies, prayer nights, and service projects, we embrace Titus 2's call to teach what is good. Find laughter, tears, and unwavering support as we approach God's throne together.",
    cta: "Thursdays at 6 PM: Come as you are, leave transformed.",
    image: "",
    icon: "women",
    order: 3,
    status: "published",
  },
  {
    name: "Marrieds of Grace Ministry",
    description:
      "Strengthening couples through biblical teaching and mentorship! Whether you're newlyweds or celebrating decades together, find practical tools to communicate, forgive, and keep God at the center. When marriages thrive, families flourish!",
    cta: "Date Night & Devotion: Monthly gatherings—childcare provided!",
    image: "",
    icon: "marrieds",
    order: 4,
    status: "published",
  },
  {
    name: "Children of Grace (COG) Ministry",
    description:
      "Introducing kids to God's love through interactive lessons and worship! Every Sunday, we create a joyful environment where young hearts learn to trust Jesus, pray boldly, and love others. Even the smallest hands are lifted high in praise!",
    cta: "Parents: Check-in opens 15 minutes before service!",
    image: "",
    icon: "children",
    order: 5,
    status: "published",
  },
  {
    name: "Schools Ministry",
    description:
      "Bringing God's truth into classrooms through mentorship and chaplaincy! We partner with local schools to equip teachers with Christ-like leadership and empower students to stand firm in their faith. From weekly Bible clubs to crisis support, we bridge the gap between faith and education.",
    cta: "Teachers/Volunteers: Join our 'Adopt-a-School' prayer team! Students: Dive into our after-school Bible clubs every Wednesday at 3 PM.",
    image: "",
    icon: "schools",
    order: 6,
    status: "published",
  },
];

type LeanMinistry = {
  _id: unknown;
  name: string;
  description: string;
  cta?: string;
  image?: string;
  icon?: MinistryIconKey;
  order?: number;
  status: ContentStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

function toMinistryView(doc: LeanMinistry): MinistryView {
  return {
    id: String(doc._id),
    name: doc.name,
    description: doc.description,
    cta: doc.cta ?? "",
    image: doc.image ?? "",
    icon: doc.icon ?? "",
    order: typeof doc.order === "number" ? doc.order : 0,
    status: doc.status,
    createdAt: doc.createdAt?.toISOString() ?? new Date(0).toISOString(),
    updatedAt: doc.updatedAt?.toISOString() ?? new Date(0).toISOString(),
  };
}

function sortMinistries(items: MinistryView[]): MinistryView[] {
  return [...items].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

function toDefaultViews(): MinistryView[] {
  return DEFAULT_MINISTRIES.map((ministry, index) => ({
    ...ministry,
    id: `default-${index + 1}`,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  }));
}

function toDoc(input: MinistryInput) {
  return {
    name: input.name,
    description: input.description,
    cta: input.cta,
    image: input.image,
    icon: input.icon || undefined,
    order: input.order,
    status: input.status,
  };
}

async function ensureDefaultMinistries(): Promise<void> {
  const count = await MinistryModel.countDocuments();
  if (count > 0) return;

  await MinistryModel.insertMany(DEFAULT_MINISTRIES.map(toDoc));
}

export async function listMinistries(): Promise<MinistryView[]> {
  await connectToDatabase();
  await ensureDefaultMinistries();
  const docs = await MinistryModel.find().lean<LeanMinistry[]>();
  return sortMinistries(docs.map(toMinistryView));
}

export async function getPublishedMinistries(): Promise<MinistryView[]> {
  try {
    await connectToDatabase();
    await ensureDefaultMinistries();
    const docs = await MinistryModel.find({ status: "published" }).lean<LeanMinistry[]>();
    return sortMinistries(docs.map(toMinistryView));
  } catch (error) {
    console.warn(
      "Published ministries unavailable — rendering seeded defaults.",
      error instanceof Error ? error.message : error
    );
    return sortMinistries(toDefaultViews());
  }
}

function isObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export async function getMinistryById(id: string): Promise<MinistryView | null> {
  if (!isObjectId(id)) return null;
  await connectToDatabase();
  const doc = await MinistryModel.findById(id).lean<LeanMinistry | null>();
  return doc ? toMinistryView(doc) : null;
}

export async function createMinistry(input: MinistryInput): Promise<MinistryView> {
  await connectToDatabase();
  const doc = await MinistryModel.create(toDoc(input));
  const lean = await MinistryModel.findById(doc._id).lean<LeanMinistry | null>();
  if (!lean) throw new Error("Ministry could not be read back after creation.");
  return toMinistryView(lean);
}

export async function updateMinistry(
  id: string,
  input: MinistryInput
): Promise<MinistryView | null> {
  if (!isObjectId(id)) return null;
  await connectToDatabase();
  const { icon, ...fields } = toDoc(input);
  const update = icon
    ? { $set: { ...fields, icon } }
    : { $set: fields, $unset: { icon: 1 } };
  const doc = await MinistryModel.findByIdAndUpdate(id, update, {
    returnDocument: "after",
    runValidators: true,
  }).lean<LeanMinistry | null>();
  return doc ? toMinistryView(doc) : null;
}

export async function deleteMinistry(id: string): Promise<MinistryView | null> {
  if (!isObjectId(id)) return null;
  await connectToDatabase();
  const doc = await MinistryModel.findById(id).lean<LeanMinistry | null>();
  if (!doc) return null;
  await MinistryModel.deleteOne({ _id: doc._id });
  return toMinistryView(doc);
}
