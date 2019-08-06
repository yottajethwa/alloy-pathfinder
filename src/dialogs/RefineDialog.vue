<template>
  <v-dialog v-model='dialog' max-width='700'>
    <v-card>
      <v-toolbar dark color='blue'>
        <v-toolbar-title>Path Selection</v-toolbar-title>
      </v-toolbar>
      <v-card-text class='title font-weight-light'>How do you want to navigate to {{destinationName()}}?</v-card-text>
      <v-toolbar>
        <v-icon left>search</v-icon>
        <v-text-field v-model='searchDialog'></v-text-field>
      </v-toolbar>
      <v-list two-line>
        <template v-for='(link, index) in links'>
          <v-list-tile
            :key='index'
            avatar
            @click='selectLink(link)'>
            <v-avatar :color='linkColour(link)' tile>
              <v-icon color='white'>link</v-icon>
            </v-avatar>
            <v-list-tile-content class='pl-3'>
              <v-list-tile-title>{{linkTitle(link)}}</v-list-tile-title>
              <v-list-tile-sub-title>{{linkSubtitle(link)}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-spacer></v-spacer>
            <v-icon right>keyboard_arrow_right</v-icon>
          </v-list-tile>
        </template>
      </v-list>
    </v-card>
  </v-dialog>
</template>



<script>
import { Store } from '@/store/Store';
export default {
  name: 'refinedialog',
  data() {
     return {
      searchDialog: '',
     }
  },
  computed: {
    dialog: {
      set(name) {
        const d = Store.blueprints().getDialog();
        if (d) {
          Store.blueprints().hideDialog();
          this.searchDialog = '';
          return;
        }
        Store.blueprints().showDialog();
      },
      get() {
        return Store.blueprints().getDialog();
      }
    },
    links() {
      const dodi = Store.blueprints().getCurrentDodi();
      const destinationCode = Store.blueprints().getDestinationDodi();
      if (dodi && destinationCode) {
        return Store.blueprints().getLinkOptions(dodi, destinationCode).filter((a) => 
            a.name.toLowerCase().includes(this.searchDialog.toLowerCase()) ||
            this.attSubtitle(a).toLowerCase().includes(this.searchDialog.toLowerCase()) 
          );
      }
      return [];
    },
  },
  methods: {
    destinationName() {
      const destinationCode = Store.blueprints().getDestinationDodi();
      if(destinationCode) {
        const dodi = Store.blueprints().getDodiByCode(destinationCode);
        return dodi ? dodi.name : 'Unknown';
      }
      return 'Unknown';
    },
    getDodiName() {
      if(!this.sourceDodi) {
        return 'None';
      }
      const dodi = Store.blueprints().getCurrentDodi();
      if (dodi.interface) {
        return dodi.name + ' Interface';
      }
      return dodi.name + ' Design';
    },
    linkTitle(link) {
      return 'Via ' + link.name;
    },
    linkSubtitle(link) {
      if(link.description) {
        return link.description;
      }
      const dodi = Store.blueprints().getDodiByCode(link.linksTo);
      let destination = dodi.name;
      if (dodi.interface) {
        destination += ' Interface';
      }
      return 'Link to ' + destination;
    },
    linkColour(link) {
      const dodi = Store.blueprints().getDodiByCode(link.linksTo);
      if(dodi.interface) {
        return 'orange';
      }
      return dodi.colour;
    },
    selectLink(link) {
      Store.blueprints().addPath(link.linksTo);
      Store.blueprints().hideDialog();
      this.searchDialog = '';
    },
  },
};
</script>
<style>
.v-list {
  height: 500px;
  overflow-y: auto;
}
</style>
