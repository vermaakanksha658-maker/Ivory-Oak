import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        error:
          "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET, or paste an image URL instead.",
      },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Please upload a JPG, PNG, WebP, or AVIF image." },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Image is too large. The maximum size is 8 MB." },
      { status: 400 },
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = process.env.CLOUDINARY_FOLDER ?? "ivory-oak";
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const cloudinaryBody = new FormData();
  cloudinaryBody.append("file", file, file.name);
  cloudinaryBody.append("api_key", apiKey);
  cloudinaryBody.append("timestamp", String(timestamp));
  cloudinaryBody.append("folder", folder);
  cloudinaryBody.append("signature", signature);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: cloudinaryBody },
    );

    const result = (await response.json()) as {
      secure_url?: string;
      error?: { message?: string };
    };

    if (!response.ok || !result.secure_url) {
      console.error("[ivory-oak] Cloudinary upload failed", result);
      return NextResponse.json(
        { error: result.error?.message ?? "Cloudinary upload failed." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("[ivory-oak] Cloudinary request failed", error);
    return NextResponse.json(
      { error: "Could not reach Cloudinary. Please try again." },
      { status: 502 },
    );
  }
}
