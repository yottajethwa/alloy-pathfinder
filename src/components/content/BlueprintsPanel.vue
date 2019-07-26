<template>
  <v-flex xs12>
    <v-toolbar color="blue darken-4" dark flat>
      <v-toolbar-title class="font-weight-thin"
        >Available Modules</v-toolbar-title
      >
    </v-toolbar>
    <transition
      name="custom-fadein-fadeout"
      enter-active-class="animated fadeIn"
      appear
    >
      <v-expansion-panel v-model="expandedModule">
        <app-blueprints-row
          v-for="(m, i) in blueprint_modules"
          :key="i"
          :highlight="i === expandedModule"
          :blueprint_module="m"
        />
      </v-expansion-panel>
    </transition>
  </v-flex>
</template>

<script>
import BlueprintsRow from './BlueprintsRow.vue';

export default {
  props: ['blueprint_modules'],
  components: {
    'app-blueprints-row': BlueprintsRow,
  },
  data() {
    return {
      expandedModule: null,
    };
  },
};
</script>
