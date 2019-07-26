import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { Store } from '@/store/Store';
import Vuetify from 'vuetify';
import store from './store';
import './assets/styles.css';


Vue.use(Vuetify);
Vue.config.productionTip = false;

Store.config(store);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
