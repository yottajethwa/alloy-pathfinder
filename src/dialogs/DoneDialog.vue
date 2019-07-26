<template>
  <v-dialog v-model='dialog' max-width='700'>
    <v-card>
      <v-toolbar dark color='success' class='text-xs-center'>
        <v-btn icon><v-icon>check</v-icon></v-btn>
        <v-toolbar-title >Scenario Complete</v-toolbar-title>
      </v-toolbar>
      <v-card-text class='title font-weight-regular text-xs-center'>Time taken: <b>{{time}}</b> seconds</v-card-text>
      <v-card-text class='title font-weight-regular text-xs-center'>Path Ratio <b>{{pathRatio}}</b></v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { Store } from '@/store/Store';
export default {
  props : ['pathRatio'],
  name: 'DoneDialog',
  computed: {
    time() {
      return Store.blueprints().getScenarioTime();
    },
    dialog: {
      set(name) {
        const d = Store.blueprints().getDoneDialog();
        if (d) {
          Store.blueprints().hideDoneDialog();
          return;
        }
        Store.blueprints().showDoneDialog();
      },
      get() {
        return Store.blueprints().getDoneDialog();
      }
    },
  },
};
</script>
