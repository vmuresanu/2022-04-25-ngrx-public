import {
  add,
  load,
  remove,
  select,
  unselect,
  update,
} from './lib/customers.actions';

export { CustomersDataModule } from './lib/customers-data.module';
export const customersActions = { load, add, update, remove, select, unselect };
export { fromCustomers } from './lib/customers.selectors';
