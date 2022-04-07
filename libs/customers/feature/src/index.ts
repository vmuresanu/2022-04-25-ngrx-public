import { fromCustomers } from './lib/+state/customers.selectors';

export const selectSelectedCustomer = fromCustomers.selectSelectedCustomer;
export * from './lib/customers-feature.module';
