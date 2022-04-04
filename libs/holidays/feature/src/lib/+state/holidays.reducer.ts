import { Holiday } from '@eternal/holidays/model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { found } from './holidays.actions';

export interface HolidaysState {
  holidays: Holiday[];
}

const initialState: HolidaysState = { holidays: [] };

export const holidaysFeature = createFeature({
  name: 'holiday',
  reducer: createReducer(
    initialState,
    on(found, (state, { holidays }) => ({
      ...state,
      holidays,
    }))
  ),
});
