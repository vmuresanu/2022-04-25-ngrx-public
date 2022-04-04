import { fromCustomer } from './lib/+state/customers.selectors';

export const selectSelectedCustomer = fromCustomer.selectSelectedCustomer;
export * from './lib/customers-feature.module';
