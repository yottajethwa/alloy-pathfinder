import { StoreService } from '@/store/StoreService';
import { RootState, Selected } from '@/store/RootState';
import { Store } from 'vuex';

export class RootService {
  public readonly state: RootState;
  private store: StoreService<RootState>;

  constructor(store: Store<RootState>) {
    this.store = new StoreService(store);
    this.state = this.store.state;
  }

  public setDrawer(drawer: boolean) {
    this.store.commit('setDrawer', drawer);
  }

  public setLoadingMessage(message: string) {
    this.store.commit('setLoadingMessage', message);
  }

  public showLoadingDialog() {
    this.store.commit('showLoadingDialog');
  }

  public hideLoadingDialog() {
    this.store.commit('hideLoadingDialog');
  }

  public setSnackbar(message: string, type: string) {
    this.store.commit('setSnackbar', { message, type });
  }

  public hideSnackbar() {
    this.store.commit('hideSnackbar');
  }

  public setSelection(selection: Selected) {
    this.store.commit('setSelection', selection);
  }

  public async onMenuSelection(selection: Selected) {
    this.store.dispatch('onMenuSelection', selection);
  }
}
