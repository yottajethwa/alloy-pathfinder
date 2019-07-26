import { BlueprintsService } from '@/store/modules/blueprints';
import { RootService } from '@/store/RootService';
import { Store as VuexStore } from 'vuex';

// This is the abstract store class that holds every service provider that gets exposed to the rest
// of the system so we can nice and cleanly access parts of the store.
export abstract class Store {
  // Should be called at the "entry.ts" file to do the initial configuration, don't call it more
  // than once.
  public static config(store: VuexStore<any>) {
    // Guard against more than once initialisation.
    if (Store.isInitialised) {
      console.log('Attempting to initialise Store locator more than once.');
      return;
    }

    Store.isInitialised = true;

    Store.rootService = new RootService(store);
    Store.blueprintService = new BlueprintsService(store);
  }

  public static root(): RootService {
    return Store.rootService;
  }

  public static blueprints(): BlueprintsService {
    return Store.blueprintService;
  }

  private static rootService: RootService;
  private static blueprintService: BlueprintsService;
  private static isInitialised: boolean;
}
