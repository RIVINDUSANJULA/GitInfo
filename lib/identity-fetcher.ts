
async function toBase64(url: string) {
  try {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = res.headers.get('content-type') || 'image/png';
    return `data:${contentType};base64,${base64}`;
  } catch (e) {
    return null;
  }
}

export async function fetchSocialIdentity(platform: string, username: string) {
  try {
    let avatarUrl = `https://unavatar.io/${platform}/${username}`;
    let followers = null;
    let status = "Active";
    let verified = false;

    switch (platform.toLowerCase()) {
      case 'discord': {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${username}`);
        if (res.ok) {
          const { data } = await res.json();
          avatarUrl = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png`;
          status = data.discord_status;
          verified = true;
        }
        break;
      }
      
      case 'youtube': {
        const res = await fetch(`https://www.youtube.com/@${username}`);
        const html = await res.text();
        const avatarMatch = html.match(/"avatar":{"thumbnails":\[{"url":"([^"]+)"/);
        const subsMatch = html.match(/"subscriberCountText":{"simpleText":"([^"]+)"/);
        if (avatarMatch) avatarUrl = avatarMatch[1].replace(/=s[0-9]+.*$/, '=s96-c-k-c0x00ffffff-no-rj');
        followers = subsMatch ? subsMatch[1] : null;
        verified = !!avatarMatch;
        break;
      }

      case 'github': {
        const res = await fetch(`https://api.github.com/users/${username}`);
        const data = await res.json();
        avatarUrl = data.avatar_url;
        followers = `${data.followers} followers`;
        verified = true;
        break;
      }
    }

    const base64Avatar = await toBase64(avatarUrl);

    return {
      avatar: base64Avatar || avatarUrl,
      followers,
      status,
      verified
    };
  } catch (e) {
    console.error("Identity fetch failed:", e);
  }

  const fallback = `https://unavatar.io/${platform}/${username}`;
  const base64Fallback = await toBase64(fallback);

  return {
    avatar: base64Fallback || fallback,
    verified: false
  };
}
