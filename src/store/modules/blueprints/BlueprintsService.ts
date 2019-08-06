import { RootState, StoreService } from '@/store/index';
import { BlueprintsState, DodiState, AttributeState, ParentState } from './BlueprintsState';
import { Store } from 'vuex';

export class BlueprintsService {
  public readonly state: BlueprintsState;
  private store: StoreService<BlueprintsState>;

  constructor(store: Store<RootState>) {
    this.store = new StoreService(store, 'blueprintModules');
    this.state = this.store.state;
  }

  public startScenario() {
    this.store.commit('startScenario');
  }

  public stopScenario() {
    this.store.commit('stopScenario');
  }

  public getScenarioTime(dodi: string): number {
    return (this.state.scenarioEnd - this.state.scenarioStart) / 1000;
  }

  public addPath(dodi: string) {
    this.store.dispatch('addPath', dodi);
  }

  public clearPath() {
    this.store.commit('setPath', []);
  }

  public getPath() {
   return this.state.path;
  }

  public popPath() {
    const path = this.state.path;
    path.pop();
    this.store.commit('setPath', path);
  }

  public getCurrentDodi(): string | null {
    const dodi = this.state.path[this.state.path.length - 1];
    if (dodi) {
      return dodi;
    }
    return null;
  }

  public getMode() {
    return this.state.mode;
  }

  public setMode(mode: boolean) {
    this.store.commit('setMode', mode);
  }

  public getInterfaces() {
    return this.state.interfaces;
  }

  public setInterfaces(interfaces: boolean) {
    this.store.commit('setInterfaces', interfaces);
  }

  public getPathAtt() {
    return this.state.pathAttCode;
  }

  public setPathAtt(pathAttCode: string) {
    this.store.commit('setPathAttributeCode', pathAttCode);
  }

  public getDestinationDodi() {
    return this.state.destinationDodi;
  }

  public setDestinationDodi(destinationDodi: string) {
    this.store.commit('setDestinationDodi', destinationDodi);
  }


  public getParentPath() {
    return this.state.parentPathCode;
  }

  public setParentPath(parentPathCode: string) {
    this.store.commit('setParentPathCode', parentPathCode);
  }

  public setAttributes(code: string, attributes: AttributeState[]) {
    const dodis = this.state.dodis;
    const index = dodis.findIndex((d) => d.code === code);
    if (index < 0) {
      console.warn('dodi not found:', code);
    }
    dodis[index].attributes = attributes;
    this.store.commit('setDodis', dodis);
  }

  public setExtraAttributes(code: string, extraAttributes: AttributeState[]) {
    const dodis = this.state.dodis;
    const index = dodis.findIndex((d) => d.code === code);
    if (index < 0) {
      console.warn('dodi not found:', code);
    }
    dodis[index].extraAttributes = extraAttributes;
    this.store.commit('setDodis', dodis);
  }

  public setParents(code: string, parents: ParentState[]) {
    const dodis = this.state.dodis;
    const index = dodis.findIndex((d) => d.code === code);
    if (index < 0) {
      console.warn('dodi not found:', code);
    }
    dodis[index].parents = parents;
    this.store.commit('setDodis', dodis);
  }

  public setExtraParents(code: string, extraParents: ParentState[]) {
    const dodis = this.state.dodis;
    const index = dodis.findIndex((d) => d.code === code);
    if (index < 0) {
      console.warn('dodi not found:', code);
    }
    dodis[index].extraParents = extraParents;
    this.store.commit('setDodis', dodis);
  }

  public showDialog() {
    this.store.commit('setDialog', true);
  }

  public hideDialog() {
    this.store.commit('setDialog', false);
  }

  public showDoneDialog() {
    this.store.commit('setDoneDialog', true);
  }

  public hideDoneDialog() {
    this.store.commit('setDoneDialog', false);
  }

  public async loadDodis() {
    this.store.dispatch('loadBlueprintsData');
    this.state.dodis.forEach((dodi) => {
      const attributes = this.getDodiAttributes(dodi.code);
      this.setAttributes(dodi.code, attributes);
      const extraAttributes = this.getExtraAttributes(dodi.code);
      this.setExtraAttributes(dodi.code, extraAttributes);
      const parents = this.getDodiParents(dodi.code);
      this.setParents(dodi.code, parents);
      const extraParents = this.getExtraParents(dodi.code);
      this.setExtraParents(dodi.code, extraParents);
    });
  }

  public getDialog() {
    return this.state.dialog;
  }

  public getDoneDialog() {
    return this.state.doneDialog;
  }

  public getDodis(): DodiState[] {
    return this.state.dodis;
  }

  public getDodiByName(name: string): DodiState | null {
    const dodi = this.state.dodis.find((d) => d.name === name);
    if (dodi) {
      return dodi;
    }
    return null;
  }

  public getDodiByCode(code: string): DodiState | null {
    const dodi = this.state.dodis.find((d) => d.code === code);
    if (dodi) {
      return dodi;
    }
    return null;
  }

  public getAttributes(code: string): AttributeState[] {
    const dodi = this.state.dodis.find((d) => d.code === code);
    if (!dodi) {
      return [];
    }
    return dodi.attributes;
  }

  public getPrimitiveAttributes(code: string): AttributeState[] {
    const dodi = this.state.dodis.find((d) => d.code === code);
    if (!dodi) {
      return [];
    }
    return dodi.attributes.concat(dodi.extraAttributes).filter((att) => att.type !== 'Link');
  }

  public getLinks(code: string): AttributeState[] {
    const dodi = this.state.dodis.find((d) => d.code === code);
    if (!dodi) {
      return [];
    }
    const linkAtts = dodi.attributes.concat(dodi.extraAttributes).filter((att) =>
      att.type === 'Link');
    dodi.parents.concat(dodi.extraParents).map((parentLink) => {
      linkAtts.push({
        name: parentLink.name,
        code: parentLink.attCode,
        type: 'Link',
        linksTo: parentLink.code,
      });
    });
    let destinationCodes: string[] = [... new Set(linkAtts.map((l) => l.linksTo!))];
    if (!this.getInterfaces()) {
      destinationCodes = destinationCodes.filter((c) => {
        const d = this.getDodiByCode(c);
        return d ? !d.interface : false;
      });
    }
    // if the links go to the same code, consolidate the links into one
    return destinationCodes.map((destCode) => {
      const links = linkAtts.filter((la) => la.linksTo === destCode);
      if (links.length === 1) {
        return links[0];
      }
      return {
        name: 'Multiple Links',
        code: 'multiCode',
        type: 'Multiple Links',
        linksTo: destCode,
      };
    });
  }

  public getLinkOptions(code: string): AttributeState[] {
    const dodi = this.state.dodis.find((d) => d.code === code);
    if (!dodi) {
      return [];
    }
    const destinationDodiCode = this.getDestinationDodi();
    if (!destinationDodiCode) {
      return [];
    }
    const destinationDodi = this.getDodiByCode(destinationDodiCode);
    if (!destinationDodi) {
      return [];
    }

    const linkAtts = dodi.attributes.concat(dodi.extraAttributes)
      .filter((att) => att.type === 'Link')
      .map((a) => {
        a.description = 'Link to ' + destinationDodi.name + ' from ' + dodi.name;
        return a;
      });

    dodi.parents.concat(dodi.extraParents)
    .map((parentLink) => {
      linkAtts.push({
        name: parentLink.name,
        code: parentLink.attCode,
        type: 'Link',
        linksTo: parentLink.code,
        description: 'Link from ' + destinationDodi.name + ' to ' + dodi.name,
      });
    });
    return linkAtts.filter((la) => la.linksTo === destinationDodiCode);
  }

  public getParents(code: string): ParentState[] {
    const dodi = this.state.dodis.find((d) => d.code === code);
    if (!dodi) {
      return [];
    }
    return dodi.parents;
  }


  public getExtAttributes(code: string): AttributeState[] {
    const dodi = this.state.dodis.find((d) => d.code === code);
    if (!dodi) {
      return [];
    }
    return dodi.extraAttributes;
  }

  public getExtParents(code: string): ParentState[] {
    const dodi = this.state.dodis.find((d) => d.code === code);
    if (!dodi) {
      return [];
    }
    return dodi.extraParents;
  }

  public getPaths(code: string, attCode: string): AttributeState[] {
    const dodi = this.state.dodis.find((d) => d.code === code);
    if (!dodi) {
      return [];
    }
    let attributes = dodi.attributes;
    attributes = attributes.concat(dodi.extraAttributes);
    return attributes.filter((a) => a.code === attCode);
  }

  public getParentPaths(code: string, parentAttCode: string): ParentState[] {
    const dodi = this.state.dodis.find((d) => d.code === code);
    if (!dodi) {
      return [];
    }
    let parents = dodi.parents;
    parents = parents.concat(dodi.extraParents);
    return parents.filter((p) => p.attCode === parentAttCode);
  }

  public getImplmentedBy(code: string): string[] {
    // get all the dodis that implment the given dodi
    let dodis: string[] = [];
    const implementedBy = this.state.dodis.filter((d) => {
      const imp = d.implements.find((val) => val === code);
      return imp ? true : false;
    });
    // get all the dodi that implement these codes
    implementedBy.forEach((dodi) => {
      dodis = dodis.concat(this.getImplmentedBy(dodi.code));
    });
    dodis = dodis.concat(implementedBy.map((d) => d.code));
    return dodis;
  }

  public getDodiAttributes(code: string): AttributeState[] {
    const dodi = this.state.dodis.find((d) => d.code === code);
    if (!dodi) {
      return [];
    }
    const attributes = dodi.attributes;
    dodi.implements.forEach((d) => {
      this.getDodiAttributes(d).forEach((a) => {
        if (!attributes.find((att) => att.code === a.code)) {
          attributes.push(a);
        }
      });
    });
    return attributes;
  }

  public getExtraAttributes(code: string): AttributeState[] {
    // if any of these attributes is a link goes to an interface,
    // also add an attribute for every dodi that implements that interface
    const attributes = this.getDodiAttributes(code);
    const extraAttributes: AttributeState[] = [];
    attributes.forEach((attribute) => {
      if (!attribute.linksTo || !this.getDodiByCode(attribute.linksTo)!.interface ) {
        return;
      }
      // find all the designs that implement this dodi
      const dodis = this.getImplmentedBy(attribute.linksTo);
      dodis.forEach((d) => {
        extraAttributes.push({
          code: attribute.code,
          name: attribute.name,
          type: 'Link',
          linksTo: d,
        });
      });
    });
    return extraAttributes;
  }

  public getDodiParents(code: string): ParentState[] {
    const dodi = this.state.dodis.find((d) => d.code === code);
    if (!dodi) {
      return [];
    }
    const parents = dodi.parents;
    dodi.implements.forEach((d) => {
      this.getDodiParents(d).forEach((p) => {
        if (!parents.find((par) => par.code === p.code)) {
          parents.push(p);
        }
      });
    });
    return parents;
  }

  public getExtraParents(code: string): ParentState[] {
    // if any of these attributes is a link goes to an interface,
    // also add an attribute for every dodi that implements that interface
    const parents = this.getDodiParents(code);
    const extraParents: ParentState[] = [];
    parents.forEach((parent) => {
      if (!parent.code || !this.getDodiByCode(parent.code)!.interface ) {
        return;
      }
      // find all the designs that implement this dodi
      const dodis = this.getImplmentedBy(parent.code);
      dodis.forEach((d) => {
        extraParents.push({
          code: d,
          name: parent.name,
          attCode: parent.attCode,
        });
      });
    });
    return extraParents;
  }
}
