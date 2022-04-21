import { Holiday } from '@eternal/holidays/model';
import { createAction, props } from '@ngrx/store';

export const load = createAction('[Holidays] Load');
export const loaded = createAction(
  '[Holidays] Loaded',
  props<{ holidays: Holiday[] }>()
);

export const addFavourite = createAction(
  '[Holidays] Add Favourite',
  props<{ id: number }>()
);
export const removeFavourite = createAction(
  '[Holidays] Remove Favourite',
  props<{ id: number }>()
);
