import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendInquiryNotification } from "@/lib/email";
import { inquirySchema } from "@/lib/inquiry";

const RATE_LIMIT_WINDOW = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const attempts = new Map<string, number[]>();

function isRateLimited(key: string) {
  const now = Date.now();
  const history = (attempts.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW,
  );
  history.push(now);
  attempts.set(key, history);

  if (attempts.size > 2000) {
    for (const [entry, timestamps] of attempts) {
      if (timestamps.every((timestamp) => now - timestamp > RATE_LIMIT_WINDOW)) {
        attempts.delete(entry);
      }
    }
  }

  return history.length > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error:
          "Too many enquiries from this connection. Please try again in a little while or message us on WhatsApp.",
      },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request. Please try again." },
      { status: 400 },
    );
  }

  const parsed = inquirySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the form and try again.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  if (data.startedAt && Date.now() - data.startedAt < 1200) {
    return NextResponse.json(
      { error: "That was quick! Please take a moment and try again." },
      { status: 400 },
    );
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        error:
          "The enquiry desk is being connected. Please message us on WhatsApp or email the studio for now.",
      },
      { status: 503 },
    );
  }

  try {
    let productId: string | null = null;
    if (data.productId) {
      const product = await prisma.product.findUnique({
        where: { id: data.productId },
        select: { id: true },
      });
      productId = product?.id ?? null;
    }

    let serviceId: string | null = null;
    let serviceTitle: string | null = null;
    if (data.serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: data.serviceId },
        select: { id: true, title: true },
      });
      serviceId = service?.id ?? null;
      serviceTitle = service?.title ?? null;
    }

    const interest = serviceTitle ?? data.interest;
    const message = interest
      ? `Interested in: ${interest}\n\n${data.message}`
      : data.message;

    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        message,
        source: data.source ?? "contact",
        productId,
        serviceId,
      },
      select: { id: true },
    });

    await sendInquiryNotification({
      inquiryId: inquiry.id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      message,
      source: data.source ?? "contact",
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[ivory-oak] Failed to save enquiry", error);
    return NextResponse.json(
      {
        error:
          "We couldn't save your enquiry right now. Please message us on WhatsApp or try again shortly.",
      },
      { status: 500 },
    );
  }
}
