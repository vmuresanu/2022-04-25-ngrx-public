import { createAction, props } from '@ngrx/store';

export const syncLocalStorage = createAction(
  '[Core] Sync Local Storage',
  props<{ featureState: string }>()
);
