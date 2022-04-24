import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import {
  CustomersComponentModule,
  CustomersViewModel,
} from '@eternal/customers/ui';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CustomersRepository } from '@eternal/customers/data';

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
  viewModel$: Observable<CustomersViewModel> =
    this.customersRepository.pagedCustomers$.pipe(
      map((pagedCustomers) => ({
        customers: pagedCustomers.customers,
        pageIndex: pagedCustomers.page - 1,
        length: pagedCustomers.total,
      }))
    );

  constructor(private customersRepository: CustomersRepository) {}

  setSelected(id: number) {
    this.customersRepository.select(id);
  }

  setUnselected() {
    this.customersRepository.unselect();
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
