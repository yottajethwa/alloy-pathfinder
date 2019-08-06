export interface BlueprintsState {
  dodis: DodiState[];
  path: string[];
  pathAttCode: string | null;
  parentPathCode: string | null;
  mode: boolean;
  dialog: boolean;
  doneDialog: boolean;
  scenarioStart: number;
  scenarioEnd: number;
  interfaces: boolean;
  destinationDodi: string | null;
}
export interface AttributeState {
  code: string;
  name: string;
  type: string;
  linksTo?: string;
  description?: string;
}

export interface ParentState {
  code: string;
  name: string;
  attCode: string;
}

export interface DodiState {
  code: string;
  colour: string;
  name: string;
  interface: boolean;
  parents: ParentState[];
  extraParents: ParentState[];
  attributes: AttributeState[];
  extraAttributes: AttributeState[];
  implements: string[];
}
