import { NextRequest, NextResponse } from "next/server";
import { fetchUserLanguages, aggregateLanguages } from "@/lib/github-api";

export const runtime = "edge"; // Use Edge runtime as requested

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  const includeContribs = searchParams.get("include_contribs") === "true";
  const forceRefresh = searchParams.get("forceRefresh") === "true";

  try {
    const userData = await fetchUserLanguages(username, includeContribs, forceRefresh);
    const aggregated = aggregateLanguages(userData);

    // Sort and limit to top 5 as requested
    const top5 = aggregated.slice(0, 5);

    return NextResponse.json(top5, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch data" }, { status: 500 });
  }
}
