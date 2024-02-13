import { Octokit } from '@octokit/core';

let octokit: Octokit;

export function setOctokit(accessToken: string) {
  octokit = new Octokit({
    auth: accessToken,
  });
}

export async function getRepoList(params: {
  type?: 'all' | 'public' | 'private' | 'owner' | 'member';
  sort?: 'created' | 'updated' | 'pushed' | 'full_name';
  direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}) {
  // https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-the-authenticated-user
  const { data } = await octokit.request('GET /user/repos', {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
    ...params,
  });

  return data;
}
export type Repo = Awaited<ReturnType<typeof getRepoList>>[number];

export async function getAllRepoList(params: {
  type?: 'all' | 'public' | 'private' | 'owner' | 'member';
  sort?: 'created' | 'updated' | 'pushed' | 'full_name';
  direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}) {
  const data: Repo[] = [];
  async function getData(page = 1) {
    const result = await getRepoList({
      ...params,
      page,
    });
    data.push(...result);
    if (result.length >= (params.per_page || 30)) {
      await getData(page + 1);
    }
  }
  await getData();
  return data;
}

export async function archiveRepo({
  owner,
  repo,
  archived = true,
}: {
  owner: string;
  repo: string;
  archived?: boolean;
}) {
  // https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#update-a-repository
  return octokit.request(`PATCH /repos/{owner}/{repo}`, {
    owner,
    repo,
    archived,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
}

export async function deleteRepo({ owner, repo }: { owner: string; repo: string }) {
  // https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#delete-a-repository
  return octokit.request(`DELETE /repos/{owner}/{repo}`, {
    owner,
    repo,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
}

export async function getStarList(params: {
  sort?: 'created' | 'updated';
  direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}) {
  //docs.github.com/en/rest/activity/starring?apiVersion=2022-11-28#list-repositories-starred-by-the-authenticated-user
  const { data } = await octokit.request('GET /user/starred', {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
    ...params,
  });
  return data;
}

export async function getAllStarList(params: {
  sort?: 'created' | 'updated';
  direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}) {
  const data: Repo[] = [];
  async function getData(page = 1) {
    const result = await getStarList({
      ...params,
      page,
    });
    data.push(...result);
    if (result.length >= (params.per_page || 30)) {
      await getData(page + 1);
    }
  }
  await getData();
  return data;
}
export type Star = Awaited<ReturnType<typeof getStarList>>[number];

export async function cancelStar({ owner, repo }: { owner: string; repo: string }) {
  // https://docs.github.com/en/rest/activity/starring?apiVersion=2022-11-28#unstar-a-repository-for-the-authenticated-user
  await octokit.request(`DELETE /user/starred/{owner}/{repo}`, {
    owner,
    repo,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
}

export async function getWatchList(params: { per_page?: number; page?: number }) {
  // https://docs.github.com/en/rest/activity/watching?apiVersion=2022-11-28#list-repositories-watched-by-the-authenticated-user
  const { data } = await octokit.request('GET /user/subscriptions', {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
    ...params,
  });
  return data;
}

export async function getAllWatchList(params: { per_page?: number; page?: number }) {
  const data: Watch[] = [];
  async function getData(page = 1) {
    const result = await getWatchList({
      ...params,
      page,
    });
    data.push(...result);
    if (result.length >= (params.per_page || 30)) {
      await getData(page + 1);
    }
  }
  await getData();
  return data;
}
export type Watch = Awaited<ReturnType<typeof getWatchList>>[number];

export async function cancelWatch({ owner, repo }: { owner: string; repo: string }) {
  // https://docs.github.com/en/rest/activity/watching?apiVersion=2022-11-28#delete-a-repository-subscription
  await octokit.request(`DELETE /repos/{owner}/{repo}/subscription`, {
    owner,
    repo,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
}
