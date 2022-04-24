import { createFeature, createReducer, on } from '@ngrx/store';
import { loaded } from './bookings.actions';

export type BookingStatus =
  | 'pending'
  | 'booked'
  | 'paid'
  | 'cancelled'
  | 'finished';

export interface Booking {
  id: number;
  holidayId: number;
  bookingDate: Date;
  status: BookingStatus;
  comment: string;
}

export interface BookingsState {
  bookings: Booking[];
  loaded: boolean;
}

const initialState: BookingsState = {
  bookings: [],
  loaded: false,
};

export const bookingsFeature = createFeature({
  name: 'bookings',
  reducer: createReducer(
    initialState,
    on(loaded, (state, action) => ({
      ...state,
      bookings: action.bookings,
      loaded: true,
    }))
  ),
});
