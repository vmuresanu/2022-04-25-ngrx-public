import { Customer } from '@eternal/customers/model';
import { createSelector } from '@ngrx/store';
import { customersFeature } from './customers.reducer';

const { selectCustomers, selectSelectedId } = customersFeature;

const selectById = (id: number) =>
  createSelector(selectCustomers, (state: Customer[]) =>
    state.find((p) => p.id === id)
  );

const selectSelectedCustomer = createSelector(
  selectCustomers,
  selectSelectedId,
  (customers, selectedId) =>
    customers.find((customer) => customer.id === selectedId)
);

export const selectCustomerWithSelected = createSelector(
  selectCustomers,
  selectSelectedId,
  (customers, selectedId) =>
    customers.map((customer) => ({
      ...customer,
      selected: customer.id === selectedId,
    }))
);

export const fromCustomers = {
  selectCustomers,
  selectCustomerWithSelected,
  selectSelectedCustomer,
  selectById,
};
