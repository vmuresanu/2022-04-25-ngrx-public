import { Customer } from '@eternal/customers/model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { load, loaded, select, unselect } from './customers.actions';

export interface CustomersState {
  customers: Customer[];
  page: number;
  total: number;
  selectedId: number | undefined;
  isLoaded: boolean;
}

export const initialState: CustomersState = {
  customers: [],
  page: 0,
  total: 0,
  selectedId: undefined,
  isLoaded: false,
};

export const customersFeature = createFeature({
  name: 'customers',
  reducer: createReducer<CustomersState>(
    initialState,
    on(load, (state, { page }) => ({
      ...state,
      page,
    })),
    on(loaded, (state, { customers, total }) => ({
      ...state,
      customers,
      total,
      isLoaded: true,
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
