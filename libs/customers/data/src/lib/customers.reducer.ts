import { Customer } from '@eternal/customers/model';
import { createFeature, createReducer, on } from '@ngrx/store';
import {
  init,
  load,
  loadFailure,
  loadSuccess,
  select,
  unselect,
} from './customers.actions';

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
    on(init, (state) => {
      if (state.hasError) {
        return initialState;
      }
      return state;
    }),
    on(load, (state, { page }) => ({
      ...state,
      page,
    })),
    on(loadSuccess, (state, { customers, total }) => ({
      ...state,
      customers,
      total,
      isLoaded: true,
    })),
    on(loadFailure, (state) => ({
      ...state,
      hasError: true,
    })),
    on(select, (state, { id }) => ({
      ...state,
      selectedId: id,
    })),
    on(unselect, (state) => ({
      ...state,
      selectedId: undefined,
    }))
  ),
});
