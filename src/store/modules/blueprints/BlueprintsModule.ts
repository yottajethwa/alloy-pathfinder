import { ActionContext, Module } from 'vuex';
import { RootState } from '@/store/RootState';
import { Store } from '@/store/Store';
import { BlueprintsState, DodiState, AttributeState, ParentState } from './BlueprintsState';
import blueprintdata from '@/data/data.json';

export const BlueprintsModule: Module<
  BlueprintsState,
  RootState
> = {
  namespaced: true,
  state: {
    dodis: [],
    path: [],
    pathAttCode: null,
    parentPathCode: null,
    mode: true,
    dialog: false,
    doneDialog: false,
    scenarioStart: Date.now(),
    scenarioEnd: Date.now(),
    interfaces: false,
    destinationDodi: null,
  },
  mutations: {
    setDodis,
    setPath,
    setMode,
    setDialog,
    setDoneDialog,
    setPathAttributeCode,
    setParentPathCode,
    startScenario,
    stopScenario,
    setInterfaces,
    setDestinationDodi,
  },
  actions: {
    addPath,
    loadBlueprintsData,
  },
};

function setDodis(
  state: BlueprintsState,
  dodis: DodiState[],
) {
  state.dodis = dodis;
}

function setPath(
  state: BlueprintsState,
  path: string[],
) {
  state.path = path;
}

function setMode(
  state: BlueprintsState,
  mode: boolean,
) {
  state.mode = mode;
}

function setDialog(
  state: BlueprintsState,
  dialog: boolean,
) {
  state.dialog = dialog;
}

function setInterfaces(
  state: BlueprintsState,
  interfaces: boolean,
) {
  state.interfaces = interfaces;
}

function setDoneDialog(
  state: BlueprintsState,
  doneDialog: boolean,
) {
  state.doneDialog = doneDialog;
}

function setPathAttributeCode(
  state: BlueprintsState,
  pathAttCode: string,
) {
  state.pathAttCode = pathAttCode;
}

function setDestinationDodi(
  state: BlueprintsState,
  destinationDodi: string,
) {
  state.destinationDodi = destinationDodi;
}

function setParentPathCode(
  state: BlueprintsState,
  parentPathCode: string,
) {
  state.parentPathCode = parentPathCode;
}

function startScenario(state: BlueprintsState) {
  state.scenarioStart = Date.now();
}

function stopScenario(state: BlueprintsState) {
  state.scenarioEnd = Date.now();
}

function addPath({state, commit}: ActionContext<BlueprintsState, RootState>, dodi: string ) {
  const path = state.path;
  path.push(dodi);
  commit('setPath', path);
}

async function loadBlueprintsData({
  state,
  commit,
}: ActionContext<BlueprintsState, RootState>) {
  const allData: { [key: string]: any } = blueprintdata.data.objects;
  let dodis: DodiState[] = [];
  const parents: { [key: string]: ParentState[] } = {};
  const addToImplements: { [key: string]: string[] } = {};
  for (const key in allData) {
    if (allData.hasOwnProperty(key)) {
      if (key.startsWith('designs_') || key.startsWith('designInterfaces_') ) {
        const dodi = allData[key];
        let imples = [];
        // implements
        if (dodi.hasOwnProperty('implements')) {
          imples = dodi.implements;
        }
        // addToImplements
        if (dodi.hasOwnProperty('addToImplements')) {
          dodi.addToImplements.forEach((dest: string) => {
            if (!addToImplements.hasOwnProperty(dest)) {
              addToImplements[dest] = [];
            }
            addToImplements[dest].push(dodi.code);
          });
        }
        // attributes
        const attributes: AttributeState[] = dodi.attributes.map((att: any) => {
          let linksTo;
          if (att.type === 'Link') {
            linksTo = att.options.code;
            if (!parents.hasOwnProperty(linksTo)) {
              parents[linksTo] = [];
            }
            parents[linksTo].push({
              code: dodi.code,
              name: att.name.en,
              attCode: att.code,
            });
          }
          return {
            code: att.code,
            name: att.name.en,
            type: att.type,
            linksTo,
          };
        });
        dodis.push({
          code: dodi.code,
          interface: dodi.__type === 'interface',
          name: dodi.name.en,
          colour: dodi.colour,
          implements: imples,
          attributes,
          extraAttributes: [],
          parents: [],
          extraParents: [],
        });
      }
    }
  }
  // set the parents
  dodis = dodis.map((dodi) => {
    if (parents.hasOwnProperty(dodi.code)) {
      dodi.parents = parents[dodi.code];
    }
    return dodi;
  });
  // add the addToImplements
  dodis = dodis.map((dodi) => {
    if (addToImplements.hasOwnProperty(dodi.code)) {
      addToImplements[dodi.code].forEach((d) => {
        dodi.implements.push(d);
      });
    }
    return dodi;
  });
  commit('setDodis', dodis);
}
