import { holidaysFeature } from './holidays.reducer';
import { createSelector } from '@ngrx/store';
import { createHistorySelectors } from 'ngrx-wieder';

const selectHolidaysWithFavourite = createSelector(
  holidaysFeature.selectHolidays,
  holidaysFeature.selectFavouriteIds,
  (holidays, favouriteIds) =>
    holidays.map((holiday) => ({
      ...holiday,
      isFavourite: favouriteIds.includes(holiday.id),
    }))
);

const { selectLoadStatus } = holidaysFeature;

const selectIdTitles = createSelector(
  holidaysFeature.selectHolidays,
  (holidays) => holidays.map(({ id, title }) => ({ id, title }))
);

const { selectCanUndo, selectCanRedo } = createHistorySelectors(
  holidaysFeature.selectHolidaysState
);

export const fromHolidays = {
  get: holidaysFeature.selectHolidays,
  selectHolidaysWithFavourite,
  selectIdTitles,
  selectLoadStatus,
  selectCanUndo,
  selectCanRedo,
};
