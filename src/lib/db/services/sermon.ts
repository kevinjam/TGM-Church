import {
  connectToDatabase,
  SermonModel,
  type ContentStatus,
  type SermonCategory,
  type SermonType,
} from "@/lib/db";

/**
 * Sermons collection service.
 *
 * Defaults reproduce src/data/sermons.ts so the public /sermons page looks
 * identical before staff add or edit anything.
 */

export interface SermonView {
  id: string;
  title: string;
  speaker: string;
  /** Display date as shown on the public site, e.g. "October 15, 2024". */
  date: string;
  description: string;
  category: SermonCategory;
  scripture: string;
  thumbnail: string;
  youtubeUrl: string;
  audioUrl: string;
  castboxUrl: string;
  castboxEmbedUrl: string;
  duration: string;
  type: SermonType;
  featured: boolean;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SermonInput {
  title: string;
  speaker: string;
  date: string;
  description: string;
  category: SermonCategory;
  scripture: string;
  thumbnail: string;
  youtubeUrl: string;
  audioUrl: string;
  castboxUrl: string;
  castboxEmbedUrl: string;
  duration: string;
  type: SermonType;
  featured: boolean;
  status: ContentStatus;
}

export const DEFAULT_SERMONS: SermonInput[] = [
  {
    title: "Walking in Grace",
    speaker: "Pastor Joseph Kinene",
    date: "October 15, 2024",
    description:
      "Discover how to walk daily in the grace of God and experience His transforming power in your life.",
    category: "Sunday Service",
    scripture: "Ephesians 2:8-9",
    thumbnail: "",
    youtubeUrl: "https://www.youtube.com/embed/VIDEO_ID_1",
    audioUrl: "",
    castboxUrl: "",
    castboxEmbedUrl: "",
    duration: "45:30",
    type: "video",
    featured: false,
    status: "published",
  },
  {
    title: "The Power of Faith",
    speaker: "Pastor Joseph Kinene",
    date: "October 8, 2024",
    description:
      "Understanding how faith moves mountains and transforms impossible situations into testimonies.",
    category: "Sunday Service",
    scripture: "Hebrews 11:1",
    thumbnail: "",
    youtubeUrl: "https://www.youtube.com/embed/VIDEO_ID_2",
    audioUrl: "",
    castboxUrl: "",
    castboxEmbedUrl: "",
    duration: "42:15",
    type: "video",
    featured: false,
    status: "published",
  },
  {
    title: "Living in Victory",
    speaker: "Pastor Joseph Kinene",
    date: "October 1, 2024",
    description:
      "Learn how to live a victorious Christian life through the power of the Holy Spirit.",
    category: "Sunday Service",
    scripture: "1 Corinthians 15:57",
    thumbnail: "",
    youtubeUrl: "https://www.youtube.com/embed/VIDEO_ID_3",
    audioUrl: "",
    castboxUrl: "",
    castboxEmbedUrl: "",
    duration: "38:45",
    type: "video",
    featured: false,
    status: "published",
  },
  {
    title: "The Love of God",
    speaker: "Pastor Joseph Kinene",
    date: "September 24, 2024",
    description:
      "Exploring the depth and breadth of God's unconditional love for His children.",
    category: "Bible Study",
    scripture: "Romans 8:38-39",
    thumbnail: "",
    youtubeUrl: "https://www.youtube.com/embed/VIDEO_ID_4",
    audioUrl: "",
    castboxUrl: "",
    castboxEmbedUrl: "",
    duration: "35:20",
    type: "video",
    featured: false,
    status: "published",
  },
  {
    title: "Youth Revival Night",
    speaker: "Pastor Joseph Kinene",
    date: "September 20, 2024",
    description:
      "A powerful message for the next generation about their purpose and calling in Christ.",
    category: "Youth",
    scripture: "1 Timothy 4:12",
    thumbnail: "",
    youtubeUrl: "https://www.youtube.com/embed/VIDEO_ID_5",
    audioUrl: "",
    castboxUrl: "",
    castboxEmbedUrl: "",
    duration: "50:10",
    type: "video",
    featured: false,
    status: "published",
  },
  {
    title: "Worship and Praise",
    speaker: "Pastor Joseph Kinene",
    date: "September 17, 2024",
    description:
      "Understanding the importance of worship and praise in our daily walk with God.",
    category: "Worship",
    scripture: "Psalm 100:1-2",
    thumbnail: "",
    youtubeUrl: "https://www.youtube.com/embed/VIDEO_ID_6",
    audioUrl: "",
    castboxUrl: "",
    castboxEmbedUrl: "",
    duration: "41:25",
    type: "video",
    featured: false,
    status: "published",
  },
  {
    title: "The Power of Grace",
    speaker: "Pastor John Smith",
    date: "October 12, 2024",
    description:
      "An in-depth study of how grace transforms our lives and empowers us to live for Christ.",
    category: "Sunday Service",
    scripture: "Titus 2:11-12",
    thumbnail: "",
    youtubeUrl: "",
    audioUrl: "",
    castboxUrl: "https://castbox.fm/episode/The-Power-of-Grace-id1234567",
    castboxEmbedUrl: "https://castbox.fm/embed/episode/The-Power-of-Grace-id1234567",
    duration: "43:15",
    type: "audio",
    featured: false,
    status: "published",
  },
  {
    title: "Faith That Moves Mountains",
    speaker: "Pastor Sarah Johnson",
    date: "October 5, 2024",
    description:
      "Learning to develop unshakeable faith that can move any mountain in your life.",
    category: "Sunday Service",
    scripture: "Matthew 17:20",
    thumbnail: "",
    youtubeUrl: "",
    audioUrl: "",
    castboxUrl: "https://castbox.fm/episode/Faith-That-Moves-Mountains-id1234568",
    castboxEmbedUrl:
      "https://castbox.fm/embed/episode/Faith-That-Moves-Mountains-id1234568",
    duration: "39:30",
    type: "audio",
    featured: false,
    status: "published",
  },
  {
    title: "The Joy of Salvation",
    speaker: "Pastor Michael Brown",
    date: "September 28, 2024",
    description:
      "Discovering the true joy that comes from knowing Jesus Christ as your personal Savior.",
    category: "Sunday Service",
    scripture: "Psalm 51:12",
    thumbnail: "",
    youtubeUrl: "",
    audioUrl: "",
    castboxUrl: "https://castbox.fm/episode/The-Joy-of-Salvation-id1234569",
    castboxEmbedUrl: "https://castbox.fm/embed/episode/The-Joy-of-Salvation-id1234569",
    duration: "36:45",
    type: "audio",
    featured: false,
    status: "published",
  },
  {
    title: "Walking in the Spirit",
    speaker: "Pastor Emily Davis",
    date: "September 21, 2024",
    description:
      "Understanding how to walk daily in the power and guidance of the Holy Spirit.",
    category: "Bible Study",
    scripture: "Galatians 5:16",
    thumbnail: "",
    youtubeUrl: "",
    audioUrl: "",
    castboxUrl: "https://castbox.fm/episode/Walking-in-the-Spirit-id1234570",
    castboxEmbedUrl: "https://castbox.fm/embed/episode/Walking-in-the-Spirit-id1234570",
    duration: "44:20",
    type: "audio",
    featured: false,
    status: "published",
  },
  {
    title: "Youth Leadership",
    speaker: "Pastor David Wilson",
    date: "September 18, 2024",
    description:
      "Empowering young people to become leaders in their generation for Christ.",
    category: "Youth",
    scripture: "1 Timothy 4:12",
    thumbnail: "",
    youtubeUrl: "",
    audioUrl: "",
    castboxUrl: "https://castbox.fm/episode/Youth-Leadership-id1234571",
    castboxEmbedUrl: "https://castbox.fm/embed/episode/Youth-Leadership-id1234571",
    duration: "37:55",
    type: "audio",
    featured: false,
    status: "published",
  },
  {
    title: "The Heart of Worship",
    speaker: "Pastor Lisa Anderson",
    date: "September 14, 2024",
    description:
      "Understanding what true worship means and how to worship God in spirit and truth.",
    category: "Worship",
    scripture: "John 4:24",
    thumbnail: "",
    youtubeUrl: "",
    audioUrl: "",
    castboxUrl: "https://castbox.fm/episode/The-Heart-of-Worship-id1234572",
    castboxEmbedUrl: "https://castbox.fm/embed/episode/The-Heart-of-Worship-id1234572",
    duration: "40:10",
    type: "audio",
    featured: false,
    status: "published",
  },
  {
    title: "Connecting Hearts to His Grace",
    speaker: "Pastor Joseph Kinene",
    date: "October 1, 2024",
    description:
      "Our foundational message about connecting hearts to God's throne of grace.",
    category: "Sunday Service",
    scripture: "Hebrews 4:16",
    thumbnail: "",
    youtubeUrl: "https://www.youtube.com/embed/VIDEO_ID_7",
    audioUrl: "",
    castboxUrl: "https://castbox.fm/episode/Connecting-Hearts-to-His-Grace-id1234573",
    castboxEmbedUrl:
      "https://castbox.fm/embed/episode/Connecting-Hearts-to-His-Grace-id1234573",
    duration: "46:30",
    type: "both",
    featured: false,
    status: "published",
  },
];

type LeanSermon = {
  _id: unknown;
  title: string;
  speaker: string;
  date: string;
  description: string;
  category: SermonCategory;
  scripture?: string;
  thumbnail?: string;
  youtubeUrl?: string;
  audioUrl?: string;
  castboxUrl?: string;
  castboxEmbedUrl?: string;
  duration?: string;
  type: SermonType;
  featured?: boolean;
  status: ContentStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

function toSermonView(doc: LeanSermon): SermonView {
  return {
    id: String(doc._id),
    title: doc.title,
    speaker: doc.speaker,
    date: doc.date,
    description: doc.description,
    category: doc.category,
    scripture: doc.scripture ?? "",
    thumbnail: doc.thumbnail ?? "",
    youtubeUrl: doc.youtubeUrl ?? "",
    audioUrl: doc.audioUrl ?? "",
    castboxUrl: doc.castboxUrl ?? "",
    castboxEmbedUrl: doc.castboxEmbedUrl ?? "",
    duration: doc.duration ?? "",
    type: doc.type,
    featured: Boolean(doc.featured),
    status: doc.status,
    createdAt: doc.createdAt?.toISOString() ?? new Date(0).toISOString(),
    updatedAt: doc.updatedAt?.toISOString() ?? new Date(0).toISOString(),
  };
}

function displayDateValue(value: string): number {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function sortSermons(items: SermonView[]): SermonView[] {
  return [...items].sort((a, b) => {
    const featured = Number(b.featured) - Number(a.featured);
    if (featured !== 0) return featured;
    return displayDateValue(b.date) - displayDateValue(a.date);
  });
}

function toDefaultViews(): SermonView[] {
  return DEFAULT_SERMONS.map((sermon, index) => ({
    ...sermon,
    id: `default-${index + 1}`,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  }));
}

async function ensureDefaultSermons(): Promise<void> {
  const count = await SermonModel.countDocuments();
  if (count > 0) return;

  await SermonModel.insertMany(
    DEFAULT_SERMONS.map((sermon) => ({
      title: sermon.title,
      speaker: sermon.speaker,
      date: sermon.date,
      description: sermon.description,
      category: sermon.category,
      scripture: sermon.scripture,
      thumbnail: sermon.thumbnail,
      youtubeUrl: sermon.youtubeUrl,
      audioUrl: sermon.audioUrl,
      castboxUrl: sermon.castboxUrl,
      castboxEmbedUrl: sermon.castboxEmbedUrl,
      duration: sermon.duration,
      type: sermon.type,
      featured: sermon.featured,
      status: sermon.status,
    }))
  );
}

function toDoc(input: SermonInput) {
  return {
    title: input.title,
    speaker: input.speaker,
    date: input.date,
    description: input.description,
    category: input.category,
    scripture: input.scripture,
    thumbnail: input.thumbnail,
    youtubeUrl: input.youtubeUrl,
    audioUrl: input.audioUrl,
    castboxUrl: input.castboxUrl,
    castboxEmbedUrl: input.castboxEmbedUrl,
    duration: input.duration,
    type: input.type,
    featured: input.featured,
    status: input.status,
  };
}

export async function listSermons(): Promise<SermonView[]> {
  await connectToDatabase();
  await ensureDefaultSermons();
  const docs = await SermonModel.find().lean<LeanSermon[]>();
  return sortSermons(docs.map(toSermonView));
}

export async function getPublishedSermons(): Promise<SermonView[]> {
  try {
    await connectToDatabase();
    await ensureDefaultSermons();
    const docs = await SermonModel.find({ status: "published" }).lean<LeanSermon[]>();
    return sortSermons(docs.map(toSermonView));
  } catch (error) {
    console.warn(
      "Published sermons unavailable — rendering seeded defaults.",
      error instanceof Error ? error.message : error
    );
    return sortSermons(toDefaultViews());
  }
}

function isObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

export async function getSermonById(id: string): Promise<SermonView | null> {
  if (!isObjectId(id)) return null;
  await connectToDatabase();
  const doc = await SermonModel.findById(id).lean<LeanSermon | null>();
  return doc ? toSermonView(doc) : null;
}

export async function createSermon(input: SermonInput): Promise<SermonView> {
  await connectToDatabase();
  const doc = await SermonModel.create(toDoc(input));
  const lean = await SermonModel.findById(doc._id).lean<LeanSermon | null>();
  if (!lean) throw new Error("Sermon could not be read back after creation.");
  return toSermonView(lean);
}

export async function updateSermon(
  id: string,
  input: SermonInput
): Promise<SermonView | null> {
  if (!isObjectId(id)) return null;
  await connectToDatabase();
  const doc = await SermonModel.findByIdAndUpdate(
    id,
    { $set: toDoc(input) },
    { returnDocument: "after", runValidators: true }
  ).lean<LeanSermon | null>();
  return doc ? toSermonView(doc) : null;
}

export async function deleteSermon(id: string): Promise<SermonView | null> {
  if (!isObjectId(id)) return null;
  await connectToDatabase();
  const doc = await SermonModel.findById(id).lean<LeanSermon | null>();
  if (!doc) return null;
  await SermonModel.deleteOne({ _id: doc._id });
  return toSermonView(doc);
}
