import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Customer } from '@eternal/customers/model';
import { CustomerComponentModule } from '@eternal/customers/ui';
import { Options } from '@eternal/shared/form';
import { fromMaster } from '@eternal/shared/master-data';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { customersActions } from '@eternal/customers/data';

@Component({
  selector: 'eternal-add-customer',
  template: ` <eternal-customer
    [customer]="customer"
    *ngIf="countries$ | async as countries"
    [countries]="countries"
    (save)="submit($event)"
    [showDeleteButton]="false"
  ></eternal-customer>`,
})
export class AddCustomerComponent {
  customer: Customer = {
    id: 0,
    firstname: '',
    name: '',
    country: '',
    birthdate: '',
  };
  countries$: Observable<Options>;

  constructor(private store: Store) {
    this.countries$ = this.store.select(fromMaster.selectCountries);
  }

  submit(customer: Customer) {
    this.store.dispatch(
      customersActions.add({ customer: { ...customer, id: 0 } })
    );
  }
}

@NgModule({
  declarations: [AddCustomerComponent],
  exports: [AddCustomerComponent],
  imports: [CustomerComponentModule, CommonModule],
})
export class AddCustomerComponentModule {}
