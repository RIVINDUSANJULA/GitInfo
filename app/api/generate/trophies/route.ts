import { NextRequest, NextResponse } from "next/server";
import { fetchTrophyData } from "@/lib/github-api";
import { generateTrophySvg } from "@/lib/svg-trophy-generator";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const username = searchParams.get("username");

  if (!username) {
    return new NextResponse("Username is required", { status: 400 });
  }

  const layout = (searchParams.get("layout") || "vault") as 'vault' | 'citadel' | 'minimalist';
  const rankFloor = (searchParams.get("rankFloor") || "C") as string;
  const showGlow = searchParams.get("showGlow") !== "false";
  const hidden = searchParams.get("hidden")?.split(",") || [];
  const theme = searchParams.get("theme") || "default";

  try {
    const allTrophies = await fetchTrophyData(username);
    
    const RANK_ORDER = ['SSS', 'SS', 'A', 'B', 'C'];
    const floorIdx = RANK_ORDER.indexOf(rankFloor);

    const filteredTrophies = allTrophies
      .filter(t => !hidden.includes(t.label))
      .filter(t => {
        const trophyIdx = RANK_ORDER.indexOf(t.rank);
        return trophyIdx <= floorIdx;
      });

    const svg = generateTrophySvg(filteredTrophies, { layout, showGlow, theme });

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    console.error("SVG Generation Error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
