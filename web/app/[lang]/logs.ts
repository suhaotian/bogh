import { produce } from 'immer';
import { create } from 'use-one';

const initialState = {
  logs: [] as {
    id: number;
    type: 'delete' | 'archive' | 'cancel-star' | 'cancel-watch';
    status: 'pending' | 'success' | 'error';
    title: string;
    message: string;
  }[],
};

const [useStore, store] = create(initialState);

export { useStore, store };

export function produceState(cb: (state: typeof initialState) => void) {
  store.setState(produce(cb));
}

export function log(msg: (typeof initialState)['logs'][number]) {
  produceState((state) => {
    const idx = state.logs.findIndex((item) => item.id === msg.id);
    if (idx > -1) {
      Object.assign(state.logs[idx], msg);
    } else {
      state.logs.unshift(msg);
    }
  });
}
