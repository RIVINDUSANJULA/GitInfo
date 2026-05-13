import { Trophy } from "@/store/useBuilderStore";

const RANK_COLORS: Record<string, string> = {
  'SSS': '#00f3ff',
  'SS': '#00f3ff',
  'A': '#00ff41',
  'B': '#888888', // Stealth Slate (adjusted for text/icon visibility)
  'C': '#888888',
};

const ICONS: Record<string, string> = {
  'Stars': '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  'Commits': '<path d="M6 12h12M12 6v12M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>',
  'Followers': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'PRs': '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 9v7c0 1.1.9 2 2 2h7"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/>',
  'Issues': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
};

export function generateTrophySvg(trophies: Trophy[], config: {
  layout: 'vault' | 'citadel' | 'minimalist',
  showGlow: boolean,
  theme: string
}) {
  const cardWidth = 140;
  const cardHeight = 140;
  const gap = 20;
  const padding = 20;

  let width = 800;
  let height = 200;

  if (config.layout === 'citadel') {
    width = (cardWidth * 3) + (gap * 2) + (padding * 2);
    height = Math.ceil(trophies.length / 3) * (cardHeight + gap) + (padding * 2);
  } else if (config.layout === 'vault') {
    width = trophies.length * (cardWidth + gap) + (padding * 2);
    height = cardHeight + (padding * 2);
  } else {
    width = trophies.length * (40 + 10) + (padding * 2);
    height = 60 + (padding * 2);
  }

  const cards = trophies.map((t, i) => {
    let x = padding, y = padding;
    if (config.layout === 'citadel') {
      x += (i % 3) * (cardWidth + gap);
      y += Math.floor(i / 3) * (cardHeight + gap);
    } else if (config.layout === 'vault') {
      x += i * (cardWidth + gap);
    } else {
      x += i * 50;
      return renderMinimal(t, x, y, config.showGlow);
    }
    return renderCard(t, x, y, config.showGlow);
  }).join('\n');

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .trophy-text { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 900; }
        .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; fill: #888; }
        .rank { font-size: 24px; fill: white; }
        .value { font-size: 8px; fill: #666; }
        @keyframes pulse {
          0% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
          100% { opacity: 0.3; transform: scale(1); }
        }
        .high-rank-glow { animation: pulse 2s infinite; transform-origin: center; }
      </style>
      <defs>
        <filter id="glass" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      ${cards}
    </svg>
  `;
}

function renderCard(trophy: Trophy, x: number, y: number, showGlow: boolean) {
  const color = RANK_COLORS[trophy.rank];
  const isHighRank = trophy.rank === 'SSS' || trophy.rank === 'SS';
  const hasGlow = showGlow && trophy.rank !== 'B' && trophy.rank !== 'C';
  
  return `
    <g transform="translate(${x}, ${y})">
      <!-- Shell -->
      ${hasGlow ? `<rect x="-10" y="-10" width="160" height="160" rx="40" fill="${color}" fill-opacity="0.1" class="high-rank-glow" />` : ''}
      <rect width="140" height="140" rx="40" fill="#0D1117" stroke="${hasGlow ? color : '#30363D'}" stroke-width="1" stroke-opacity="${hasGlow ? 0.4 : 1}" />
      
      <!-- Icon Housing -->
      <rect x="45" y="20" width="50" height="50" rx="20" fill="#161B22" stroke="${hasGlow ? color : 'none'}" stroke-width="1" stroke-opacity="0.3" />
      <g transform="translate(58, 33) scale(1)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${hasGlow ? color : '#888'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${ICONS[trophy.label] || ''}
        </svg>
      </g>

      <text x="70" y="90" text-anchor="middle" class="trophy-text label">${trophy.label}</text>
      <text x="70" y="115" text-anchor="middle" class="trophy-text rank" style="${hasGlow ? `filter: url(#glow); fill: ${color};` : ''}">${trophy.rank}</text>
      <text x="70" y="130" text-anchor="middle" class="trophy-text value">${trophy.value.toLocaleString()}</text>
    </g>
  `;
}

function renderMinimal(trophy: Trophy, x: number, y: number, showGlow: boolean) {
  const color = RANK_COLORS[trophy.rank];
  const hasGlow = showGlow && trophy.rank !== 'B' && trophy.rank !== 'C';

  return `
    <g transform="translate(${x}, ${y})">
      <rect width="40" height="40" rx="20" fill="#0D1117" stroke="${hasGlow ? color : '#30363D'}" stroke-width="1" />
      <g transform="translate(10, 10) scale(0.8)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${hasGlow ? color : '#888'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${ICONS[trophy.label] || ''}
        </svg>
      </g>
    </g>
  `;
}
