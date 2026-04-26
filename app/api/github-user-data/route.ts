import { NextRequest, NextResponse } from "next/server";
import { fetchUserLanguages, aggregateLanguages, aggregateSkills } from "@/lib/github-api";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const username = searchParams.get("username");

  if (!username) {
    return new NextResponse("Username is required", { status: 400 });
  }

  const includeContribs = searchParams.get("include_contribs") === "true";
  const forceRefresh = searchParams.get("forceRefresh") === "true";

  try {
    console.log(`[GitInfo] Fetching real-time data for: ${username} (force: ${forceRefresh})`);
    const userData = await fetchUserLanguages(username, includeContribs, forceRefresh);
    const languages = aggregateLanguages(userData, false); 
    const skills = aggregateSkills(userData);

    return NextResponse.json({ languages, skills });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
