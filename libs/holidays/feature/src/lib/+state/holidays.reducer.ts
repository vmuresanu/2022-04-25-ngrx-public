import { Holiday } from '@eternal/holidays/model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { loaded } from './holidays.actions';

export interface HolidaysState {
  holidays: Holiday[];
}

const initialState: HolidaysState = { holidays: [] };

export const holidaysFeature = createFeature({
  name: 'holidays',
  reducer: createReducer(
    initialState,
    on(loaded, (state, { holidays }) => ({
      ...state,
      holidays,
    }))
  ),
});
