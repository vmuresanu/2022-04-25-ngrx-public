import { Component } from '@angular/core';
import { BookingsRepository } from '../+state/bookings-repository.service';
import { CustomersApi } from '@eternal/customers/api';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { ViewModel } from '../overview/overview.component';

@Component({
  selector: 'eternal-overview-container',
  template: `<eternal-overview
    *ngIf="viewModel$ | async as viewModel"
    [viewModel]="viewModel"
  ></eternal-overview>`,
})
export class OverviewContainerComponent {
  // we have here two bugs which we'll eliminate later...
  readonly viewModel$: Observable<ViewModel> = combineLatest({
    bookings: this.bookingsRepository.bookings$,
    loaded: this.bookingsRepository.loaded$,
    customer: this.customersApi.selectedCustomer$,
  }).pipe(
    filter(({ loaded }) => {
      if (loaded === false) {
        this.bookingsRepository.load();
      }
      return loaded;
    }),
    map(({ customer, bookings }) => ({
      customerName: `${customer.name}, ${customer.firstname}`,
      bookings,
    }))
  );

  constructor(
    private bookingsRepository: BookingsRepository,
    private customersApi: CustomersApi
  ) {}
}
