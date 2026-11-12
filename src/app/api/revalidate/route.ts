import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { SANITY_TAG } from "@/sanity/lib/client";

/**
 * Sanity webhook target. In sanity.io/manage → API → Webhooks:
 *   URL: https://<site>/api/revalidate, trigger on create/update/delete,
 *   filter: _type in ["library", "series", "comic"], secret: SANITY_REVALIDATE_SECRET
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      true, // wait for the Content Lake to be consistent before revalidating
    );
    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    // expire: 0 = drop the cache now, so the next visitor sees the new comic (not stale-while-revalidate).
    revalidateTag(SANITY_TAG, { expire: 0 });
    return NextResponse.json({ revalidated: true, type: body?._type });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
