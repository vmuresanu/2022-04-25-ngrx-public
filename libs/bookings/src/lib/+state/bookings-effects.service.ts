import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { filter, map } from 'rxjs';
import { load, loaded } from './bookings.actions';
import { Booking } from './bookings.reducer';
import { CustomersApi } from '@eternal/customers/api';

const bookings: Map<number, Booking[]> = new Map<number, Booking[]>();
bookings.set(1, [
  {
    id: 1,
    holidayId: 1,
    bookingDate: new Date(2022, 1, 2),
    status: 'pending',
    comment: "A little bit unsure about the holiday. Let's see",
  },
  {
    id: 2,
    holidayId: 2,
    bookingDate: new Date(2022, 1, 2),
    status: 'cancelled',
    comment: 'Seemed to be a little bit stressed out',
  },
]);
bookings.set(3, [
  {
    id: 3,
    holidayId: 1,
    bookingDate: new Date(2022, 1, 2),
    status: 'finished',
    comment:
      "According to Jeremy, he's a quite a grumbler. Complains all the time and nothing seems to be satisfactory.",
  },
]);

@Injectable()
export class BookingsEffects {
  constructor(private actions$: Actions, private customersApi: CustomersApi) {}

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(load),
      concatLatestFrom(() => this.customersApi.selectedCustomer$),
      map(([, customerId]) => customerId),
      filter(Boolean),
      map((customer) => loaded({ bookings: bookings.get(customer.id) || [] }))
    )
  );
}
