import { Customer } from '@eternal/customers/model';
import { createFeature, createReducer } from '@ngrx/store';
import {
  init,
  load,
  loadFailure,
  loadSuccess,
  select,
  unselect,
} from './customers.actions';
import { immerOn } from 'ngrx-immer/store';
import { safeAssign } from '@eternal/shared/util';

export interface CustomersState {
  customers: Customer[];
  page: number;
  total: number;
  selectedId: number | undefined;
  isLoaded: boolean;
  hasError: boolean;
}

export const initialState: CustomersState = {
  customers: [],
  page: 0,
  total: 0,
  selectedId: undefined,
  isLoaded: false,
  hasError: false,
};

export const customersFeature = createFeature({
  name: 'customers',
  reducer: createReducer<CustomersState>(
    initialState,
    immerOn(init, (state) => {
      if (state.hasError) {
        // This will not work: state = initialState;
        safeAssign(state, initialState);
      }
    }),
    immerOn(load, (state, { page }) => {
      state.page = page;
    }),
    immerOn(loadSuccess, (state, { customers, total }) => {
      safeAssign(state, {
        customers,
        total,
        isLoaded: true,
        hasError: false,
      });
    }),
    immerOn(loadFailure, (state) => {
      state.hasError = true;
    }),
    immerOn(select, (state, { id }) => {
      state.selectedId = id;
    }),
    immerOn(unselect, (state) => {
      state.selectedId = undefined;
    })
  ),
});
