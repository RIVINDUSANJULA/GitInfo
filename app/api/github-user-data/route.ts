import { NextRequest, NextResponse } from "next/server";
import { fetchUserLanguages, aggregateLanguages } from "@/lib/github-api";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const username = searchParams.get("username");

  if (!username) {
    return new NextResponse("Username is required", { status: 400 });
  }

  const includeContribs = searchParams.get("include_contribs") === "true";

  try {
    const userData = await fetchUserLanguages(username, includeContribs);
    const aggregated = aggregateLanguages(userData);

    return NextResponse.json(aggregated);
  } catch (error: any) {
    console.error("API Route Error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
