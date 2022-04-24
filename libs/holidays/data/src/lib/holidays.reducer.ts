import { Holiday } from '@eternal/holidays/model';
import { createFeature, createReducer, on } from '@ngrx/store';
import {
  favouriteAdded,
  favouriteRemoved,
  load,
  loaded,
} from './holidays.actions';
import { LoadStatus } from '@eternal/shared/ngrx-utils';

export interface HolidaysState {
  holidays: Holiday[];
  favouriteIds: number[];
  loadStatus: LoadStatus;
}

const initialState: HolidaysState = {
  holidays: [],
  favouriteIds: [],
  loadStatus: 'not loaded',
};

export const holidaysFeature = createFeature({
  name: 'holidays',
  reducer: createReducer<HolidaysState>(
    initialState,
    on(load, (state) => ({
      ...state,
      loadStatus: 'loading',
    })),
    on(loaded, (state, { holidays }) => ({
      ...state,
      loadStatus: 'loaded',
      holidays,
    })),
    on(favouriteAdded, (state, { id }) => {
      if (state.favouriteIds.includes(id)) {
        return state;
      }

      return { ...state, favouriteIds: [...state.favouriteIds, id] };
    }),
    on(favouriteRemoved, (state, { id }) => ({
      ...state,
      favouriteIds: state.favouriteIds.filter(
        (favouriteId) => favouriteId !== id
      ),
    }))
  ),
});
