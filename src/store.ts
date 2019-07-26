import { RootState } from '@/store/RootState';
import { RootStore } from '@/store/RootStore';
import Vue from 'vue';
import Vuex from 'vuex';

// Make it globally accessible through the Vue object.
Vue.use(Vuex);

// Export the global Vuex Store.
export default new Vuex.Store<RootState>(RootStore);
