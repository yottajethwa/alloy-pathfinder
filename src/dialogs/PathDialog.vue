<template>
  
  <v-layout row> 
    <app-refine-dialog></app-refine-dialog>
    <app-done-dialog :pathRatio='pathRatio()'></app-done-dialog>
    <v-flex xs12 sm6 offset-sm3>
      <v-card min-height='200px' class='pa-3 mb-3'>
        <v-toolbar-title class='pa-3'>Scenarios</v-toolbar-title>
       <v-btn @click='scenario1()' dark :color="scenario===1 ? 'green' : 'blue'">Scenario 1</v-btn>
       <v-btn @click='scenario2()' dark :color="scenario===2 ? 'green' : 'blue'">Scenario 2</v-btn>
       <v-btn @click='scenario3()' dark :color="scenario===3 ? 'green' : 'blue'">Scenario 3</v-btn>
       <v-btn @click='scenario4()' dark :color="scenario===4 ? 'green' : 'blue'">Scenario 4</v-btn>
       <v-btn icon @click='toggleMode()' outline left>{{mode}}</v-btn>
       <v-card-text class='title font-weight-light'>{{scenarioText}}</v-card-text>
      </v-card>
      <v-card>
        <!-- <v-toolbar
          dark
          color='grey'
          >
          <v-toolbar-title>DODI</v-toolbar-title>
            <v-autocomplete
              v-model='sourceDodi'
              :items='names'
              cache-items
              class='mx-3'
              flat
              hide-no-data
              label='Design or Interface'
              solo-inverted
          ></v-autocomplete>
        </v-toolbar> -->
        <v-toolbar
          dark
          color='blue'
          >
          <v-btn v-if='backValid()' icon @click='back()'>
            <v-icon>arrow_back</v-icon>
          </v-btn>
          
          <v-toolbar-title>{{getDodiName()}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click='clear()'>
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar
          >
          <v-icon left>search</v-icon>
          <v-text-field v-model='search'></v-text-field>
        </v-toolbar>
        <v-list two-line>

          <template v-for='(att, index) in attributes'>
            <v-list-tile
              :key='index'
              avatar
              @click='selectDodiLink(att)'
            >
             <v-avatar v-if='att.selected' color='green'>
               <v-icon color='white'>check</v-icon>
              </v-avatar>
              
              <v-avatar v-else :color='attColour(att)' tile>
                <v-toolbar-title v-if="att.type !== 'Link'" class='white--text'><b>{{attIcon(att)}}</b></v-toolbar-title>
                <v-icon v-else color='white'>link</v-icon>
              </v-avatar>
              <v-list-tile-content class='pl-3'>
                <v-list-tile-title v-html='att.name'></v-list-tile-title>
                <v-list-tile-sub-title>{{attSubtitle(att)}}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-spacer></v-spacer>
              <v-icon v-if="att.type === 'Link'" right>keyboard_arrow_right</v-icon>
            </v-list-tile>
          </template>

          <template v-for='(parent, index) in parents'>
            <v-list-tile
              :key='index + 1000'
              avatar
               @click='selectParentLink(parent)'
            >
              <v-avatar dark :color='parentColour(parent)' text-color='white' tile>
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
      <v-card>
       
      </v-card>
      <v-card>
      <v-card-text class='white--text'>{{path}}</v-card-text>
    </v-card>
    </v-flex>

  </v-layout>
  
</template>

<script>
import { Store } from '@/store/Store';
import RefineDialog from './RefineDialog';
import DoneDialog from './DoneDialog';
export default {
  components: {
    'app-refine-dialog': RefineDialog,
    'app-done-dialog': DoneDialog,
  },
  data() {
     return {
      search: '',
      selected: [],
      scenario: 0,
      scenarioText: '',
      destination: '',
      pathLength: 0,
     }
  },
  computed: {
    sourceDodi: {
      set(name) {
        const code = Store.blueprints().getDodiByName(name).code;
        Store.blueprints().addPath(code);
      },
      get() {
        return Store.blueprints().getCurrentDodi();
      }
    },
    attributes() {
      if (this.sourceDodi) {
        let atts = Store.blueprints().getAttributes(this.sourceDodi);
        if (Store.blueprints().getMode()) {
          atts = atts.concat(Store.blueprints().getExtAttributes(this.sourceDodi));
        }
        if (this.search) {
          return atts.filter((a) => 
            a.name.toLowerCase().includes(this.search.toLowerCase()) ||
            this.attSubtitle(a).toLowerCase().includes(this.search.toLowerCase()) 
          ).map((a) => {
              a.selected = this.isSelected(a.code);
              return a;
            });
        }
        return atts.map((a) => {
          a.selected = this.isSelected(a.code);
          return a;
        });
      }
      return [];
    },
    parents() {
      if (this.sourceDodi) {
        let pars = Store.blueprints().getParents(this.sourceDodi);
        if (Store.blueprints().getMode()) {
          pars = pars.concat(Store.blueprints().getExtParents(this.sourceDodi));
        }
        if (this.search) {
          return pars.filter((p) => 
            this.parentTitle(p).toLowerCase().includes(this.search.toLowerCase()) ||
            this.parentSubtitle(p).toLowerCase().includes(this.search.toLowerCase()) 
          );
        }
        return pars;
      }
      return [];
    },
    names() {
      return Store.blueprints().getDodis().map((d) => d.name);
    },
    path() {
      return Store.blueprints().getPath().join(' > ');
    },
    mode() {
      return Store.blueprints().getMode() ? 'A' : 'B';
    },
  },
  methods: {
    back() {
      Store.blueprints().popPath();
    },
    clear() {
      Store.blueprints().clearPath();
    },
    backValid() {
      return Store.blueprints().getPath().length > 1;
    },

    getDodiName() {
      if(!this.sourceDodi) {
        return 'None';
      }
      const dodi = Store.blueprints().getDodiByCode(this.sourceDodi);
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
    attIcon(attribute) {
      if(attribute.type === 'String') {
        return 'Tt';
      }
      if(attribute.type === 'Number') {
        return '123';
      }
      if(attribute.type === 'Boolean') {
        return 'B';
      }
      if(attribute.type === 'Link') {
        return 'L';
      }
      return 'A';
    },
    attColour(attribute) {
      if(attribute.type === 'Link') {
        const dodi = Store.blueprints().getDodiByCode(attribute.linksTo);
        if(dodi.interface) {
          return 'orange';
        }
        return dodi.colour;
      }
      const dodi = Store.blueprints().getDodiByCode(this.sourceDodi);
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
      const suffix = dodi.interface ? ' Interface' : ' Design'
      return Store.blueprints().getDodiByCode(parent.code).name + suffix;
    },
    parentSubtitle(parent) {
      return 'Link via ' + parent.name;
    },
    selectDodiLink(attribute) {
      this.search = '';
      if(!attribute.linksTo) {
        if (!this.isSelected(attribute.code)) {
          console.log(attribute.code, this.destination);
          if (attribute.code === this.destination) {
            Store.blueprints().stopScenario();
            Store.blueprints().showDoneDialog();
          }
          this.selected.push(attribute.code);
        } else {
          this.selected = this.selected.filter((code) => code !== attribute.code);
        }
        return;
      }
      const dodi = Store.blueprints().getDodiByCode(attribute.linksTo);
      if (dodi.interface && !Store.blueprints().getMode()) {
        Store.blueprints().setPathAtt(attribute.code);
        Store.blueprints().setParentPath(null);
        Store.blueprints().showDialog();
        return;
      }
      this.sourceDodi = dodi.name;
    },
    isSelected(attCode) {
      return this.selected.find((code) => attCode === code);
    },
    selectParentLink(parent) {
      this.search = '';
      const dodi = Store.blueprints().getDodiByCode(parent.code);
      if (dodi.interface && !Store.blueprints().getMode()) {
        Store.blueprints().setPathAtt(null);
        Store.blueprints().setParentPath(parent.attCode);
        Store.blueprints().showDialog();
        return;
      }
      this.sourceDodi = dodi.name;
    },
    toggleMode() {
      const mode = Store.blueprints().getMode();
      Store.blueprints().setMode(!mode);
    },
    pathRatio() {
      return Store.blueprints().getPath().length + ':' + this.pathLength;
    },
    scenario1() {
      this.clear();
      this.scenario = 1;
      this.pathLength = 3;
      this.selected = [];
      Store.blueprints().startScenario();
      // go from job to Team username
      const dodi = Store.blueprints().getDodiByCode('designs_exampleJobs');
      this.destination = 'attributes_usersEmail';
      this.scenarioText = 'Find the Email address of the team member assigned to the job';
      this.sourceDodi = dodi.name;
    },
    scenario2() {
      this.clear();
      this.scenario = 2;
      this.pathLength = 2;
      this.selected = [];
      Store.blueprints().startScenario();
      // go from tasks name
      const dodi = Store.blueprints().getDodiByCode('designInterfaces_tasks');
      this.destination = 'attributes_projectsName';
      this.scenarioText = 'Find the Name attribute of the project this task is assigned to';
      this.sourceDodi = dodi.name;
    },
    scenario4() {
      this.clear();
      this.scenario = 4;
      this.pathLength = 4;
      this.selected = [];
      Store.blueprints().startScenario();
      // go from waste
      const dodi = Store.blueprints().getDodiByCode('designs_wasteRounds');
      this.destination = 'attributes_premisesPostcode';
      this.scenarioText = 'Starting with a waste round, find the postcode of the premises linked to the waste containers in this round. Hint: Containers are grouped into Waste Tasks in a round.';
      this.sourceDodi = dodi.name;
    },
    scenario3() {
      this.clear();
      this.scenario = 3;
      this.pathLength = 3;
      Store.blueprints().startScenario();
      // go from waste
      const dodi = Store.blueprints().getDodiByCode('designs_exampleJobs');
      this.destination = 'attributes_contactsFirstName';
      this.scenarioText = 'Find a first name of the reporter of a tree defect that this job was raised against';
      this.sourceDodi = dodi.name;
    }
  },
};
</script>
<style>
.v-list {
  height: 500px;
  overflow-y: auto;
}
</style>
