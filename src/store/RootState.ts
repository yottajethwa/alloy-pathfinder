export interface Selected {
  type: string;
  id: string | null;
}

export interface Snackbar {
  active: boolean;
  type: string;
  message: string;
}
export interface RootState {
  sideMenuDrawer: boolean;
  loadingDialog: boolean;
  loadingMessage: string;
  selected: Selected;
  snackbar: Snackbar;
}
