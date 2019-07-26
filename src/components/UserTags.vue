<template>
  <span class='group'>
    <v-btn
      v-for='(tag, i) in knownTags'
      :key='i'
      icon
      flat
      small
      outline
      :color="hasTag(tag)? tagColour(tag) : 'grey lighten-2'"
      @click='toggleTag(tag)'
    >{{tagCode(tag)}}</v-btn>
  </span>
</template>

<script>
import { Store } from '@/store/Store';
export default {
  name: 'UserTags',
  props: ['tags', 'username'],
  data() {
    return {
      knownTags: ['Yotta', 'Mobile'],
    };
  },
  methods: {
    hasTag(tag) {
      return this.$props.tags.includes(tag);
    },
    tagCode(tag) {
      return tag.charAt(0);
    },
    tagColour(tag) {
      switch (tag) {
        case 'Yotta':
          return 'blue';
        case 'Mobile':
          return 'orange';
        default:
          return 'black';
      }
    },
    toggleTag(tag) {
      if (this.hasTag(tag)) {
        Store.users().removeTag(this.$props.username, tag);
      } else {
        Store.users().addTag(this.$props.username, tag);
      }
    },
  },
};
</script>
