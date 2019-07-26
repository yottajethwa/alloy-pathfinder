<template>
  <div>
    <span v-for="(item, i) in items" :key="i">
      <v-tooltip :disabled="showLabel(i)" slot="append" bottom>
        <v-btn
          slot="activator"
          flat
          :disabled="i === items.length - 1"
          @click="item.nav()"
          :icon="!showLabel(i)"
        >
          <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
          <span v-if="showLabel(i)" class="pl-2">{{ item.label }}</span>
        </v-btn>
        <span>{{ item.label }}</span>
      </v-tooltip>
      <v-btn flat icon disabled>
        <v-icon v-if="i < items.length - 1">chevron_right</v-icon>
      </v-btn>
    </span>
  </div>
</template>

<script>
export default {
  name: 'breadcrumb',
  props: ['items'],
  methods: {
    showLabel(i) {
      return 1 > this.items.length - 2 - i;
    },
  },
};
</script>
