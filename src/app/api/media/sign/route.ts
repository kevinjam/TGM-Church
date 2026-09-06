import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  createSignedUpload,
  isCloudinaryConfigured,
} from "@/lib/cloudinary";
import { canUseLocalDisk } from "@/lib/media-storage";

export const dynamic = "force-dynamic";

/**
 * Returns a short-lived signed payload so the admin browser can upload
 * directly to Cloudinary (file never passes through Vercel’s body limit).
 * If Cloudinary is not configured, tells the client to use the local route.
 */
export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    if (canUseLocalDisk()) {
      return NextResponse.json({ storage: "local" });
    }
    return NextResponse.json(
      {
        error:
          "Cloud image storage is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      },
      { status: 503 }
    );
  }

  try {
    return NextResponse.json({
      storage: "cloudinary",
      ...createSignedUpload(),
    });
  } catch (error) {
    console.error("Cloudinary sign failed:", error);
    return NextResponse.json(
      { error: "Unable to prepare the cloud upload. Please try again." },
      { status: 500 }
    );
  }
}
