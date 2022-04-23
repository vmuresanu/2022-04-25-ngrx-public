import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Customer } from '@eternal/customers/model';
import { Observable } from 'rxjs';
import { fromCustomers } from './customers.selectors';
import * as customersActions from './customers.actions';
import { deepClone, filterDefined } from '@eternal/shared/ngrx-utils';

@Injectable({ providedIn: 'root' })
export class CustomersRepository {
  readonly customers$: Observable<Customer[]> = this.store
    .select(fromCustomers.selectCustomers)
    .pipe(deepClone);

  readonly pagedCustomers$: Observable<{
    customers: (Customer & { selected: boolean })[];
    total: number;
    page: number;
  }> = this.store.select(fromCustomers.selectPagedCustomers);

  readonly selectedCustomer$: Observable<Customer> = this.store
    .select(fromCustomers.selectSelectedCustomer)
    .pipe(filterDefined, deepClone);

  findById(id: number): Observable<Customer> {
    return this.store
      .select(fromCustomers.selectById(id))
      .pipe(filterDefined, deepClone);
  }

  constructor(private store: Store) {}

  load(page: number = 1): void {
    this.store.dispatch(customersActions.load({ page }));
  }

  add(customer: Customer): void {
    this.store.dispatch(customersActions.add({ customer }));
  }

  update(customer: Customer): void {
    this.store.dispatch(customersActions.update({ customer }));
  }

  remove(customer: Customer): void {
    this.store.dispatch(customersActions.remove({ customer }));
  }

  select(id: number): void {
    this.store.dispatch(customersActions.select({ id }));
  }

  unselect(): void {
    this.store.dispatch(customersActions.unselect());
  }
}
