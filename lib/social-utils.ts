
export function normalizePlatform(input: string): string {
  const platform = input.toLowerCase().trim();
  
  const mapping: Record<string, string> = {
    'twitter': 'twitter',
    'x': 'twitter',
    'insta': 'instagram',
    'instagram': 'instagram',
    'yt': 'youtube',
    'youtube': 'youtube',
    'googlex': 'youtube', // example of weird mapping if any
    'discord': 'discord',
    'dc': 'discord',
    'git': 'github',
    'github': 'github',
    'linkedin': 'linkedin',
    'li': 'linkedin',
    'tiktok': 'tiktok',
    'tk': 'tiktok',
    'gmail': 'gmail',
    'mail': 'gmail',
    'career': 'career',
    'hire': 'career',
    'work': 'career'
  };

  return mapping[platform] || platform;
}

export function getProfileUrl(platform: string, username: string): string {
  const norm = normalizePlatform(platform);
  
  const mapping: Record<string, string> = {
    youtube: `https://youtube.com/@${username}`,
    twitter: `https://x.com/${username}`,
    linkedin: `https://linkedin.com/in/${username}`,
    discord: `https://discord.com/users/${username}`,
    instagram: `https://instagram.com/${username}`,
    github: `https://github.com/${username}`,
    tiktok: `https://tiktok.com/@${username}`,
    gmail: `mailto:${username}`,
    career: `mailto:${username}`,
  };

  return mapping[norm] || '#';
}
