<template>
  <v-dialog :value="dialog" hide-overlay persistent width="300">
    <v-card color="primary" dark>
      <v-card-text class="pt-0">
        {{ message }}
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { Store } from '@/store/Store';
export default {
  computed: {
    dialog() {
      return Store.root().state.loadingDialog;
    },
    message() {
      return Store.root().state.loadingMessage;
    },
  },
};
</script>

<style scoped>
.nav-image {
  height: 50px;
  margin-top: 10px;
}
</style>
