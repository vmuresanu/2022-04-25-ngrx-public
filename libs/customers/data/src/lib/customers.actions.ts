import { Customer } from '@eternal/customers/model';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Customers] Init');
export const get = createAction('[Customers] Get', props<{ page: number }>());
export const load = createAction('[Customers] Load', props<{ page: number }>());
export const loadSuccess = createAction(
  '[Customers] Load Success',
  props<{ customers: Customer[]; total: number; page: number }>()
);
export const loadFailure = createAction('[Customers] Load Failure');

export const add = createAction(
  '[Customers] Add',
  props<{ customer: Customer }>()
);
export const added = createAction(
  '[Customers] Added',
  props<{ customers: Customer[] }>()
);

export const update = createAction(
  '[Customers] Update',
  props<{
    customer: Customer;
    forward: string;
    message: string;
    callback?: () => void;
  }>()
);
export const updated = createAction(
  '[Customers] Updated',
  props<{ customers: Customer[] }>()
);

export const remove = createAction(
  '[Customers] Remove',
  props<{ customer: Customer }>()
);
export const removed = createAction(
  '[Customers] Removed',
  props<{ customers: Customer[] }>()
);

export const select = createAction(
  '[Customers] Select',
  props<{ id: number }>()
);

export const unselect = createAction('[Customers] Unselect');
