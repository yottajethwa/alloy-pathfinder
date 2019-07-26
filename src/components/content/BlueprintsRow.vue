<template>
  <v-expansion-panel-content class="pa-0">
    <div slot="header">
      <v-icon :color="highlight ? 'blue darken-4' : 'grey'">ballot</v-icon>
      <span class="subheading pl-3">{{ blueprint_module.name }}</span>
    </div>
    <v-divider></v-divider>
    <v-card color="blue lighten-5">
      <div class="py-0 my-0 pl-3">
        <v-subheader>This module has {{ numBlueprints }}</v-subheader>
        <div class="pl-4">
          <v-chip
            v-for="(b, i) in blueprint_module.blueprints"
            :key="i"
            text-color="white"
            color="blue"
            >{{ b.name }}</v-chip
          >
        </div>
      </div>
      <div
        v-if="blueprint_module.dependencies.length > 0"
        class="py-0 my-0 pl-3"
      >
        <v-subheader
          >This module requires the following modules to be
          installed:</v-subheader
        >
        <div class="pl-4">
          <v-chip
            v-for="(d, j) in blueprint_module.dependencies"
            :key="j"
            text-color="white"
            color="orange"
            >{{ d.name }}</v-chip
          >
        </div>
      </div>
      <div v-else class="py-0 my-0 pl-3">
        <v-subheader>This module has no dependencies</v-subheader>
      </div>
      <div v-if="blueprint_module.affects.length > 0" class="py-0 my-0 pl-3">
        <v-subheader
          >This module affects the following modules (if also
          installed):</v-subheader
        >
        <div class="pl-4 pb-2">
          <v-chip
            v-for="(a, k) in blueprint_module.affects"
            :key="k"
            text-color="white"
            color="red"
            >{{ a.name }}</v-chip
          >
        </div>
      </div>
      <div v-else class="py-0 my-0 pl-3">
        <v-subheader>Does not affect other modules</v-subheader>
      </div>
    </v-card>
  </v-expansion-panel-content>
</template>

<script>
export default {
  props: ['blueprint_module', 'highlight'],
  computed: {
    numBlueprints() {
      if (this.$props.blueprint_module.blueprints.length === 1) {
        return 'only 1 blueprint:';
      } else {
        return this.$props.blueprint_module.blueprints.length + ' blueprints:';
      }
    },
  },
};
</script>
