import { NextRequest, NextResponse } from "next/server";
import * as si from 'simple-icons';

// Fallback terminal icon SVG path
const FALLBACK_ICON_PATH = "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z";

function getSimpleIcon(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/\./g, 'dot')
    .replace(/[^a-z0-9]/g, '');
  
  // Try direct slug match (e.g. 'react')
  const iconKey = 'si' + slug.charAt(0).toUpperCase() + slug.slice(1);
  if ((si as any)[iconKey]) return (si as any)[iconKey];

  // Try searching all icons if direct match fails
  for (const icon of Object.values(si)) {
    if ((icon as any).title?.toLowerCase() === name.toLowerCase()) return icon;
    if ((icon as any).slug === slug) return icon;
  }

  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const name = searchParams.get("name") || "Skill";
  const overrideColor = searchParams.get("color");
  const size = searchParams.get("size") || "md";
  const radiusParam = searchParams.get("radius");
  const useOfficialColor = searchParams.get("useOfficialColor") === "true";
  const showGlow = searchParams.get("showGlow") === "true";

  const height = size === "sm" ? 26 : 32;
  const paddingX = size === "sm" ? 10 : 14;
  const fontSize = size === "sm" ? 11 : 13;
  const radius = radiusParam !== null ? parseInt(radiusParam) : height / 4;

  // Fetch Brand Icon
  const brandIcon = getSimpleIcon(name);
  const brandColor = brandIcon ? brandIcon.hex : (overrideColor || "4f46e5");
  const finalColor = (useOfficialColor && brandIcon) ? brandColor : (overrideColor || brandColor);
  
  const iconPath = brandIcon ? brandIcon.path : FALLBACK_ICON_PATH;
  
  // Rough estimate of text width
  const textWidth = name.length * (fontSize * 0.65) + 4;
  const iconSize = height * 0.5;
  const gap = 8;
  const width = paddingX * 2 + iconSize + gap + textWidth;

  const glowFilter = showGlow ? `
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="iconGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  ` : '';

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${glowFilter}
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#${finalColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#${finalColor};stop-opacity:0.8" />
        </linearGradient>
      </defs>
      
      <rect width="${width}" height="${height}" rx="${radius}" fill="url(#grad)" ${showGlow ? 'filter="url(#glow)"' : ''}/>
      <rect width="${width}" height="${height}" rx="${radius}" fill="black" fill-opacity="0.1"/>
      
      <!-- Icon Wrapper -->
      <g transform="translate(${paddingX}, ${(height - iconSize) / 2})">
        <rect width="${iconSize}" height="${iconSize}" rx="${radius/3}" fill="white" fill-opacity="0.2"/>
        <g transform="scale(${iconSize/24})" fill="white" ${showGlow ? 'filter="url(#iconGlow)"' : ''}>
          <path d="${iconPath}"/>
        </g>
      </g>
      
      <text x="${paddingX + iconSize + gap}" y="${height / 2 + fontSize / 3 + 1}" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700" style="text-shadow: 0 1px 2px rgba(0,0,0,0.1)">${name}</text>
      
      <!-- Subtle highlight -->
      <rect x="1" y="1" width="${width - 2}" height="${height / 2}" rx="${radius}" fill="white" fill-opacity="0.1"/>
    </svg>
  `.trim();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, s-maxage=31536000, stale-while-revalidate=86400",
    },
  });
}
