import { createAction, props } from '@ngrx/store';
import { Booking } from './bookings.reducer';

export const load = createAction('[Customer Bookings] Load');
export const loaded = createAction(
  '[Customer Bookings] Loaded',
  props<{ bookings: Booking[] }>()
);
export const reset = createAction('[Customer Bookings] Reset');
