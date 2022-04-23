import { Customer } from '@eternal/customers/model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { load, loaded, select, unselect } from './customers.actions';

export interface CustomersState {
  customers: Customer[];
  page: number;
  total: number;
  selectedId: number | undefined;
}

export const initialState: CustomersState = {
  customers: [],
  page: 0,
  total: 0,
  selectedId: undefined,
};

export const customersFeature = createFeature({
  name: 'customers',
  reducer: createReducer<CustomersState>(
    initialState,
    on(load, (state) => ({
      ...state,
    })),
    on(loaded, (state, { customers, total, page }) => ({
      ...state,
      customers,
      total,
      page,
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
