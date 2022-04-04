import { Holiday } from '@eternal/holidays/model';
import { createAction, props } from '@ngrx/store';

export const find = createAction('[Holidays] Find');
export const found = createAction(
  '[Holidays] Find Success',
  props<{ holidays: Holiday[] }>()
);
