interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
}

interface GitHubStarredItem {
  starred_at: string;
  repo: GitHubRepo;
}

export interface GitHubStarredRepo {
  id: string;
  title: string;
  url: string;
  savedAt: Date;
  description: string | null;
  thumbnailUrl: null;
  meta: Record<string, unknown>;
}

export async function fetchGitHubStarredRepos(token: string, since: Date): Promise<GitHubStarredRepo[]> {
  const repos: GitHubStarredRepo[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `https://api.github.com/users/hw0k/starred?per_page=100&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.star+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub starred repos fetch failed: ${response.status}`);
    }

    const data = await response.json() as GitHubStarredItem[];

    if (data.length === 0) break;

    let reachedCutoff = false;
    for (const item of data) {
      if (new Date(item.starred_at) < since) {
        reachedCutoff = true;
        break;
      }
      const { repo } = item;
      repos.push({
        id: `github-${repo.id}`,
        title: repo.full_name,
        url: repo.html_url,
        savedAt: new Date(item.starred_at),
        description: repo.description,
        thumbnailUrl: null,
        meta: { name: repo.name, full_name: repo.full_name },
      });
    }

    if (reachedCutoff || data.length < 100) break;
    page++;
  }

  return repos;
}
