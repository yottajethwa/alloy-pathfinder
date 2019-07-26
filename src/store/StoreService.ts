import { RootState } from './RootState';
import { Store } from 'vuex';

export class StoreService<T> {
  public readonly state: T;
  protected readonly store: Store<RootState>;
  protected readonly stateKey: string;

  public constructor(store: Store<any>, stateKey?: string) {
    this.store = store;
    if (stateKey) {
      this.state = store.state[stateKey] as T;
      this.stateKey = stateKey + '/';
    } else {
      this.state = store.state;
      this.stateKey = '';
    }
  }

  public dispatch<R>(name: string, payload?: any): Promise<R> {
    return this.store.dispatch(this.stateKey + name, payload);
  }

  public commit(name: string, payload?: any) {
    this.store.commit(this.stateKey + name, payload);
  }
}
