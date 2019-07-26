import Vue from 'vue';
import VueRouter from 'vue-router';
import HomePage from './views/Home.vue';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
    },
  ],
});
