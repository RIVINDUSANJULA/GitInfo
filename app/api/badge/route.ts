import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const name = searchParams.get("name") || "Skill";
  const color = searchParams.get("color") || "4f46e5";
  const size = searchParams.get("size") || "md";
  const radiusParam = searchParams.get("radius");

  const height = size === "sm" ? 26 : 32;
  const paddingX = size === "sm" ? 10 : 14;
  const fontSize = size === "sm" ? 11 : 13;
  
  // Custom radius or default to height/4
  const radius = radiusParam !== null ? parseInt(radiusParam) : height / 4;
  
  // Rough estimate of text width to avoid needing a heavy library
  const textWidth = name.length * (fontSize * 0.65) + 4;
  const iconSize = height * 0.5;
  const gap = 8;
  const width = paddingX * 2 + iconSize + gap + textWidth;

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#${color};stop-opacity:0.8" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" rx="${radius}" fill="url(#grad)"/>
      <rect width="${width}" height="${height}" rx="${radius}" fill="black" fill-opacity="0.1"/>
      
      <!-- Simplified Icon Background -->
      <rect x="${paddingX}" y="${(height - iconSize) / 2}" width="${iconSize}" height="${iconSize}" rx="${radius/2}" fill="white" fill-opacity="0.2"/>
      
      <text x="${paddingX + iconSize + gap}" y="${height / 2 + fontSize / 3 + 1}" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700">${name}</text>
      
      <!-- Subtle highlight -->
      <rect x="1" y="1" width="${width - 2}" height="${height / 2}" rx="${radius}" fill="white" fill-opacity="0.1"/>
    </svg>
  `.trim();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
