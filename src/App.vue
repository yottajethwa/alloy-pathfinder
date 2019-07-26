<template>
  <v-app id="app">
    <router-view></router-view>
    <app-loader-dialog></app-loader-dialog>
  </v-app>
</template>

<script>
import LoaderDialog from './components/LoaderDialog.vue';
import { Store } from '@/store/Store';
export default {
  name: 'app',
  components: {
    'app-loader-dialog': LoaderDialog,
  },
  async created() {
    await Store.blueprints().loadDodis();
  }
};
</script>

<style></style>
