<template>
  <v-dialog v-model='dialog' max-width='700'>
    <v-card>
      <v-toolbar dark color='blue'>
        <v-toolbar-title>Refine Link Path</v-toolbar-title>
      </v-toolbar>
      <v-toolbar
          >
          <v-icon left>search</v-icon>
          <v-text-field v-model='searchDialog'></v-text-field>
      </v-toolbar>
      <v-list two-line>
        <template v-for='(att, index) in attributes'>
          <v-list-tile
            :key='index'
            avatar
            @click='selectLink(att)'
          >
            
            <v-avatar :color='attColour(att)' tile>
              <v-icon color='white'>link</v-icon>
            </v-avatar>
            <v-list-tile-content class='pl-3'>
              <v-list-tile-title v-html='att.name'></v-list-tile-title>
              <v-list-tile-sub-title>{{attSubtitle(att)}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-spacer></v-spacer>
            <v-icon right>keyboard_arrow_right</v-icon>
          </v-list-tile>
        </template>
        <template v-for='(parent, index) in parents'>
          <v-list-tile
            :key='index + 1000'
            avatar
              @click='selectParentLink(parent)'
          >
            <v-avatar dark :color='parentColour(parent)' tile>
              <v-icon color='white'>
                arrow_upward
              </v-icon>
            </v-avatar>

            <v-list-tile-content class='pl-3'>
              <v-list-tile-title>{{parentTitle(parent)}}</v-list-tile-title>
              <v-list-tile-sub-title>{{parentSubtitle(parent)}}</v-list-tile-sub-title>
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
    attributes() {
      const dodi = Store.blueprints().getCurrentDodi();
      const pathAttCode = Store.blueprints().getPathAtt();
      if (dodi && pathAttCode) {
        return Store.blueprints().getPaths(dodi, pathAttCode).filter((a) => 
            a.name.toLowerCase().includes(this.searchDialog.toLowerCase()) ||
            this.attSubtitle(a).toLowerCase().includes(this.searchDialog.toLowerCase()) 
          );
      }
      return [];
    },
    parents() {
      const dodi = Store.blueprints().getCurrentDodi();
      const parentPathCode = Store.blueprints().getParentPath();
      if (dodi && parentPathCode) {
        return Store.blueprints().getParentPaths(dodi, parentPathCode)
        .filter((a) => 
            this.parentTitle(a).toLowerCase().includes(this.searchDialog.toLowerCase()) ||
            this.parentSubtitle(a).toLowerCase().includes(this.searchDialog.toLowerCase()) 
          );
      }
      return [];
    },
    names() {
      return Store.blueprints().getDodis().map((d) => d.name);
    },
  },
  methods: {
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
    attSubtitle(attribute) {
      if(attribute.type === 'Link') {
        const dodi = Store.blueprints().getDodiByCode(attribute.linksTo);
        let suffix = ' Design';
        if (dodi.interface) {
          suffix = ' Interface';
        }
        return 'Link to ' + dodi.name + suffix;
      }
      return attribute.type;
    },
    attColour(attribute) {
      if(attribute.type === 'Link') {
        const dodi = Store.blueprints().getDodiByCode(attribute.linksTo);
        if(dodi.interface) {
          return 'orange';
        }
        return dodi.colour;
      }
      const dodi = Store.blueprints().getCurrentDodi();
      if(dodi.interface) {
        return 'orange';
      }
      return dodi.colour;
    },
    parentColour(parent) {
      const dodi = Store.blueprints().getDodiByCode(parent.code);
      if(dodi.interface) {
        return 'orange';
      }
      return dodi.colour;
    },
    parentTitle(parent) {
      const dodi = Store.blueprints().getDodiByCode(parent.code);
      const suffix = dodi.interface ? ' Interface' : ' Design';
      return Store.blueprints().getDodiByCode(parent.code).name + suffix;
    },
    parentSubtitle(parent) {
      return 'Link via ' + parent.name;
    },
    selectLink(attribute) {
      Store.blueprints().addPath(attribute.linksTo);
      Store.blueprints().hideDialog();
      this.searchDialog = '';
    },
    selectParentLink(parent) {
      Store.blueprints().addPath(parent.code);
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
