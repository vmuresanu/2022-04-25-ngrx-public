import {
  addFavourite,
  get,
  redo,
  removeFavourite,
  undo,
} from './lib/holidays.actions';

export * from './lib/holidays-data.module';
export const holidaysActions = {
  get,
  addFavourite,
  removeFavourite,
  redo,
  undo,
};
export { fromHolidays } from './lib/holidays.selectors';
