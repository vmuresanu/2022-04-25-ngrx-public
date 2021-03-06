import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import {
  CustomersComponentModule,
  CustomersViewModel,
} from '@eternal/customers/ui';
import { Store } from '@ngrx/store';
import { select, unselect } from '../+state/customers.actions';
import { fromCustomers } from '../+state/customers.selectors';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  template: ` <eternal-customers
    *ngIf="viewModel$ | async as viewModel"
    [viewModel]="viewModel"
    (setSelected)="setSelected($event)"
    (setUnselected)="setUnselected()"
    (switchPage)="switchPage($event)"
  ></eternal-customers>`,
})
export class CustomersContainerComponent {
  viewModel$: Observable<CustomersViewModel> = this.store
    .select(fromCustomers.selectPagedCustomers)
    .pipe(
      map((pagedCustomers) => ({
        customers: pagedCustomers.customers,
        pageIndex: pagedCustomers.page - 1,
        length: pagedCustomers.total,
      }))
    );

  constructor(private store: Store) {}

  setSelected(id: number) {
    this.store.dispatch(select({ id }));
  }

  setUnselected() {
    this.store.dispatch(unselect());
  }

  switchPage(page: number) {
    console.log('switch to page ' + page + ' is not implemented');
  }
}

@NgModule({
  declarations: [CustomersContainerComponent],
  exports: [CustomersContainerComponent],
  imports: [CommonModule, CustomersComponentModule],
})
export class CustomersContainerComponentModule {}
