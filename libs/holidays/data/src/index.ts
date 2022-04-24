import { addFavourite, get, removeFavourite } from './lib/holidays.actions';

export * from './lib/holidays-data.module';
export const holidaysActions = { get, addFavourite, removeFavourite };
export { fromHolidays } from './lib/holidays.selectors';
