import AsyncStorage from '@react-native-async-storage/async-storage';
import { produce } from 'immer';
import { create } from 'use-one';

import { log } from './logs';
import {
  archiveRepo,
  getAllRepoList,
  getAllStarList,
  getAllWatchList,
  getRepoList,
  setOctokit,
  deleteRepo,
  cancelStar,
  cancelWatch,
} from './octokit';
import type { Repo, Star, Watch } from './octokit';

const initialState = {
  ready: false,
  accessToken: '',
  repos: [] as Repo[],
  stars: [] as Star[],
  watchs: [] as Watch[],
  reposLoading: false,
  starsLoading: false,
  watchsLoading: false,
  deleteReposLoading: false,
  cancelStarsLoading: false,
  cancelWatchsLoading: false,
  deleteRepos: {} as { [key: string]: boolean },
  deletedRepos: {} as { [key: string]: boolean },
  cancelStars: {} as { [key: string]: boolean },
  canceledStars: {} as { [key: string]: boolean },
  cancelWatchs: {} as { [key: string]: boolean },
  canceledWatchs: {} as { [key: string]: boolean },
};
const [useStore, store] = create(initialState);
export { useStore, store };

export function produceState(cb: (state: typeof initialState) => void) {
  store.setState(produce(cb));
}

const getState = () => store.getState();
export const actions = {
  produceState,
  async setToken(accessToken: string) {
    setOctokit(accessToken);
    await getRepoList({ per_page: 1, type: 'owner' });
    produceState((state) => {
      state.accessToken = accessToken;
    });
  },

  async getAllRepos() {
    if (store.getState().repos.length > 0 || store.getState().reposLoading) return;
    produceState((state) => {
      state.reposLoading = true;
    });
    const repos = await getAllRepoList({ per_page: 100, type: 'owner' }).finally(() => {
      produceState((state) => {
        state.reposLoading = false;
      });
    });
    produceState((state) => {
      state.repos = repos;
    });
  },
  async getAllStars() {
    if (store.getState().stars.length > 0 || store.getState().starsLoading) return;
    produceState((state) => {
      state.starsLoading = true;
    });
    const stars = await getAllStarList({ per_page: 100 }).finally(() => {
      produceState((state) => {
        state.starsLoading = false;
      });
    });
    produceState((state) => {
      state.stars = stars;
    });
  },
  async getAllWatchs() {
    if (store.getState().watchs.length > 0 || store.getState().watchsLoading) return;
    produceState((state) => {
      state.watchsLoading = true;
    });
    const watchs = await getAllWatchList({ per_page: 100 }).finally(() => {
      produceState((state) => {
        state.watchsLoading = false;
      });
    });
    produceState((state) => {
      state.watchs = watchs;
    });
  },

  selectDeleteRepo(id: number) {
    produceState((state) => {
      state.deleteRepos[id] = !state.deleteRepos[id];
    });
  },
  selectUnstarRepo(id: number) {
    produceState((state) => {
      state.cancelStars[id] = !state.cancelStars[id];
    });
  },
  selectUnwatchRepo(id: number) {
    produceState((state) => {
      state.cancelWatchs[id] = !state.cancelWatchs[id];
    });
  },
  async archiveRepos() {
    produceState((state) => {
      state.deleteReposLoading = true;
    });
    const IDs = Object.keys(getState().deleteRepos).filter((key) => {
      return getState().deleteRepos[key];
    });
    console.log(IDs);
    const chunkResult = chunk(IDs, 5);
    console.log(chunkResult);

    for (const arr of chunkResult) {
      await Promise.all(
        arr.map((_id: number) => {
          const id = +_id;
          const item = getState().repos.find((item) => item.id == id);
          console.log(item);
          if (item && !getState().deletedRepos[id]) {
            log({ id: item.id, type: 'archive', status: 'pending', title: item.name, message: '' });
            console.log('archive repo', item);
            return archiveRepo({ owner: item.owner.login, repo: item.name, archived: true })
              .catch((e) => {
                log({
                  id: item.id,
                  type: 'archive',
                  status: 'error',
                  title: item.name,
                  message: e.message,
                });
              })
              .then(() => {
                log({
                  id: item.id,
                  type: 'archive',
                  status: 'success',
                  title: item.name,
                  message: '',
                });
              });
          }
          return Promise.resolve(1);
        })
      );
    }
    produceState((state) => {
      state.deleteReposLoading = false;
    });
  },
  async deleteRepos() {
    produceState((state) => {
      state.deleteReposLoading = true;
    });
    const IDs = Object.keys(getState().deleteRepos).filter((key) => {
      return getState().deleteRepos[key];
    });
    const chunkResult = chunk(IDs, 5);
    for (const arr of chunkResult) {
      await Promise.all(
        arr.map((_id: number) => {
          const id = +_id;
          const item = getState().repos.find((item) => item.id == id);
          if (item && !getState().deletedRepos[id]) {
            log({ id: item.id, type: 'delete', status: 'pending', title: item.name, message: '' });
            return deleteRepo({ owner: item.owner.login, repo: item.name })
              .catch((e) => {
                log({
                  id: item.id,
                  type: 'delete',
                  status: 'error',
                  title: item.name,
                  message: e.message,
                });
              })
              .then(() => {
                produceState((state) => {
                  state.deletedRepos[item.id] = true;
                });
                log({
                  id: item.id,
                  type: 'delete',
                  status: 'success',
                  title: item.name,
                  message: '',
                });
              });
          }
          return Promise.resolve(1);
        })
      );
    }
    produceState((state) => {
      state.deleteReposLoading = false;
    });
  },
  async cancelStars() {
    produceState((state) => {
      state.cancelStarsLoading = true;
    });
    const IDs = Object.keys(getState().cancelStars).filter((key) => {
      return getState().cancelStars[key];
    });
    const chunkResult = chunk(IDs, 5);
    for (const arr of chunkResult) {
      await Promise.all(
        arr.map((_id: number) => {
          const id = +_id;
          const item = getState().stars.find((item) => item.id === id);
          if (item && !getState().canceledStars[id]) {
            log({
              id: item.id,
              type: 'cancel-star',
              status: 'pending',
              title: item.name,
              message: '',
            });
            return cancelStar({ owner: item.owner.login, repo: item.name })
              .catch((e) => {
                log({
                  id: item.id,
                  type: 'cancel-star',
                  status: 'error',
                  title: item.name,
                  message: e.message,
                });
              })
              .then(() => {
                produceState((state) => {
                  state.canceledStars[item.id] = true;
                });
                log({
                  id: item.id,
                  type: 'cancel-star',
                  status: 'success',
                  title: item.name,
                  message: '',
                });
              });
          }
          return Promise.resolve(1);
        })
      );
    }
    produceState((state) => {
      state.cancelStarsLoading = false;
    });
  },
  async cancelWatchs() {
    produceState((state) => {
      state.cancelWatchsLoading = true;
    });
    const IDs = Object.keys(getState().cancelWatchs).filter((key) => {
      return getState().cancelWatchs[key];
    });
    const chunkResult = chunk(IDs, 5);
    for (const arr of chunkResult) {
      await Promise.all(
        arr.map((_id: number) => {
          const id = +_id;
          const item = getState().watchs.find((item) => item.id === id);
          if (item && !getState().canceledWatchs[id]) {
            log({
              id: item.id,
              type: 'cancel-watch',
              status: 'pending',
              title: item.name,
              message: '',
            });
            return cancelWatch({ owner: item.owner.login, repo: item.name })
              .catch((e) => {
                log({
                  id: item.id,
                  type: 'cancel-watch',
                  status: 'error',
                  title: item.name,
                  message: e.message,
                });
              })
              .then(() => {
                produceState((state) => {
                  state.canceledWatchs[item.id] = true;
                });
                log({
                  id: item.id,
                  type: 'cancel-watch',
                  status: 'success',
                  title: item.name,
                  message: '',
                });
              });
          }
          return Promise.resolve(1);
        })
      );
    }
    produceState((state) => {
      state.cancelWatchsLoading = false;
    });
  },
  reset() {
    store.setState(() => ({
      ...initialState,
      ready: true,
    }));
  },
  async loadCache() {
    const key = `__@CACHE__`;
    const catchData = await AsyncStorage.getItem(key);
    if (catchData) {
      const result = JSON.parse(catchData) as typeof initialState;
      store.setState((state) => ({
        ...state,
        ...result,
        ready: true,
      }));
      if (result.accessToken) {
        setOctokit(result.accessToken);
      }
    } else {
      produceState((state) => {
        state.ready = true;
      });
    }
    store.subscribe((state) => {
      AsyncStorage.setItem(
        key,
        JSON.stringify({
          ...state,
          repos: [],
          stars: [],
          watchs: [],
          reposLoading: false,
          starsLoading: false,
          watchsLoading: false,
          deleteReposLoading: false,
          cancelStarsLoading: false,
          cancelWatchsLoading: false,
        })
      );
    });
  },
};

function chunk(arr: any[], size: number) {
  const result: any[] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
