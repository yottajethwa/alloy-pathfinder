import { BlueprintsModule } from '@/store/modules/blueprints';
import { RootState } from './RootState';
import { StoreOptions } from 'vuex';
import { Store } from '@/store/Store';

// Defines the root store, grabbing all the internal data from it's respective files.
export const RootStore: StoreOptions<RootState> = {
  modules: {
    blueprintModules: BlueprintsModule,
  },
  state: {
    sideMenuDrawer: true,
    loadingDialog: false,
    loadingMessage: 'Loading, please wait...',
    selected: {
      type: 'Region',
      id: null,
    },
    snackbar: {
      active: false,
      type: 'success',
      message: 'Thinking...',
    },
  },
  mutations: {
    setDrawer(state, drawer) {
      state.sideMenuDrawer = drawer;
    },

    setLoadingMessage(state, message) {
      state.loadingMessage = message;
    },

    showLoadingDialog(state) {
      state.loadingDialog = true;
    },

    hideLoadingDialog(state) {
      state.loadingDialog = false;
      state.loadingMessage = 'Loading, please wait...';
    },

    setSnackbar(state, info: { message: string; type: string }) {
      state.snackbar.message = info.message;
      state.snackbar.type = info.type;
      state.snackbar.active = true;
    },

    hideSnackbar(state) {
      state.snackbar.active = false;
      state.snackbar.message = 'Thinking...';
    },

    setSelection(state, selection) {
      state.selected = selection;
    },
  },
  actions: {},
};
