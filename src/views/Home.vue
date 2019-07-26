<template>
  <app-path-dialog />
</template>

<script>
import { Store } from '@/store/Store';
import PathDialog from '@/dialogs/PathDialog';

export default {
  components: {
    'app-path-dialog': PathDialog,
  },
  data() {
    return {
      loading: false,
      error: false,
    };
  },
  methods: {
    async submit() {
      this.loading = true;
      await Store.blueprints().loadBlueprintsData();
      this.loading = false;
    },
  },
};
</script>