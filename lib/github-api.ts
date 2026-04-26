const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

// Simple in-memory cache for "Zero-Key" optimization
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 60 * 60 * 1000; // 60 minutes

export async function fetchUserLanguages(username: string, includeContribs: boolean) {
  const cacheKey = `${username}-${includeContribs}`;
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
    return cache[cacheKey].data;
  }

  const token = process.env.GITHUB_TOKEN;
  
  // If no token, use the Pro REST Aggregator (Zero-Key)
  if (!token) {
    const data = await fetchProPublicData(username);
    cache[cacheKey] = { data, timestamp: Date.now() };
    return data;
  }

  // GraphQL path (preserved for token users)
  const fetchFromGithub = async (query: string) => {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 3600 } 
    });

    const json = await response.json();
    if (json.errors) {
      if (json.errors.some((e: any) => e.type === 'RATE_LIMITED' || e.message.includes('rate limit'))) {
        throw new Error("GitHub Rate Limit Exceeded");
      }
      return { data: json.data, errors: json.errors };
    }
    return { data: json.data };
  };

  const ownedReposQuery = `
    query($username: String!) {
      user(login: $username) {
        repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, orderBy: {field: PUSHED_AT, direction: DESC}) {
          nodes {
            isPrivate
            stargazerCount
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  name
                  color
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const ownedResult = await fetchFromGithub(ownedReposQuery);
    if (!ownedResult.data?.user) throw new Error("User not found");
    const userData = { ...ownedResult.data.user };
    cache[cacheKey] = { data: userData, timestamp: Date.now() };
    return userData;
  } catch (error) {
    console.error("GitHub API Error:", error);
    throw error;
  }
}

/**
 * Advanced Byte-Count Aggregator (Pro Mode)
 * Fetches actual data from REST API without a key.
 * Respects rate limits by deep-diving only into top 10 repos.
 */
async function fetchProPublicData(username: string) {
  try {
    // 1. Fetch public repos (up to 100)
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      next: { revalidate: 3600 }
    });
    
    if (!reposRes.ok) {
      if (reposRes.status === 404) throw new Error("User not found");
      if (reposRes.status === 403) throw new Error("GitHub Rate Limit Exceeded");
      throw new Error("Failed to fetch from GitHub REST API");
    }

    const repos = await reposRes.json();
    
    // 2. Identify top 10 "High-Impact" repos for deep-dive
    // Sorted by stars and size to ensure we get meaningful byte counts
    const topRepos = [...repos]
      .sort((a, b) => (b.stargazers_count * 10 + b.size) - (a.stargazers_count * 10 + a.size))
      .slice(0, 10);

    const otherRepos = repos.filter((r: any) => !topRepos.some(tr => tr.id === r.id));

    // 3. Deep-dive into byte counts for top 10
    const topNodes = await Promise.all(topRepos.map(async (repo: any) => {
      try {
        const langRes = await fetch(repo.languages_url, { next: { revalidate: 3600 } });
        const langs = langRes.ok ? await langRes.json() : {};
        
        // Apply Weighting: Stars boost the perceived "impact" of the languages
        const weight = 1 + (repo.stargazers_count / 10);
        
        return {
          isPrivate: false,
          languages: {
            edges: Object.entries(langs).map(([name, size]) => ({
              size: (size as number) * weight,
              node: { name, color: null }
            }))
          }
        };
      } catch (e) {
        return { isPrivate: false, languages: { edges: [] } };
      }
    }));

    // 4. Fallback for other repos (use primary language and size)
    const otherNodes = otherRepos
      .filter((repo: any) => repo.language)
      .map((repo: any) => ({
        isPrivate: false,
        languages: {
          edges: [
            {
              size: repo.size || 1000,
              node: { name: repo.language, color: null }
            }
          ]
        }
      }));

    return {
      repositories: { nodes: [...topNodes, ...otherNodes] }
    };
  } catch (error) {
    console.error("Pro Public Fetch Error:", error);
    return { repositories: { nodes: [] } };
  }
}

export function aggregateLanguages(userData: any) {
  const languageMap: Record<string, { size: number; color: string }> = {};

  const processRepo = (repo: any) => {
    if (repo.isPrivate) return;
    if (!repo.languages || !repo.languages.edges) return;
    
    repo.languages.edges.forEach((edge: any) => {
      const { name, color } = edge.node;
      const size = edge.size as number;
      if (languageMap[name]) {
        languageMap[name].size += size;
      } else {
        languageMap[name] = { size, color: color || getLanguageColor(name) };
      }
    });
  };

  if (userData.repositories?.nodes) {
    userData.repositories.nodes.forEach(processRepo);
  }
  
  if (userData.repositoriesContributedTo?.nodes) {
    userData.repositoriesContributedTo.nodes.forEach(processRepo);
  }

  const totalSize = Object.values(languageMap).reduce((acc, curr) => acc + curr.size, 0);
  if (totalSize === 0) return [];

  return Object.entries(languageMap)
    .map(([name, { size, color }]) => ({
      name,
      size,
      color,
      percentage: (size / totalSize) * 100,
    }))
    .sort((a, b) => b.size - a.size);
}

function getLanguageColor(name: string): string {
  const colors: Record<string, string> = {
    'TypeScript': '#3178c6',
    'JavaScript': '#f1e05a',
    'Java': '#b07219',
    'Python': '#3572A5',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Rust': '#dea584',
    'Go': '#00ADD8',
    'C++': '#f34b7d',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Swift': '#F05138',
    'Kotlin': '#A97BFF',
    'Dart': '#00B4AB',
  };
  return colors[name] || '#cccccc';
}

function getMockData() {
  return {
    repositories: {
      nodes: [
        { languages: { edges: [{ size: 5000, node: { name: "TypeScript", color: "#3178c6" } }, { size: 2000, node: { name: "JavaScript", color: "#f1e05a" } }] } },
        { languages: { edges: [{ size: 3000, node: { name: "TypeScript", color: "#3178c6" } }, { size: 1000, node: { name: "CSS", color: "#563d7c" } }] } }
      ]
    }
  };
}
