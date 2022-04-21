import { Holiday } from '@eternal/holidays/model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { addFavourite, loaded, removeFavourite } from './holidays.actions';

export interface HolidaysState {
  holidays: Holiday[];
  favouriteIds: number[];
}

const initialState: HolidaysState = { holidays: [], favouriteIds: [] };

export const holidaysFeature = createFeature({
  name: 'holidays',
  reducer: createReducer<HolidaysState>(
    initialState,
    on(loaded, (state, { holidays }) => ({
      ...state,
      holidays,
    })),
    on(addFavourite, (state, { id }) => {
      if (state.favouriteIds.includes(id)) {
        return state;
      }

      return { ...state, favouriteIds: [...state.favouriteIds, id] };
    }),
    on(removeFavourite, (state, { id }) => ({
      ...state,
      favouriteIds: state.favouriteIds.filter(
        (favouriteId) => favouriteId !== id
      ),
    }))
  ),
});
