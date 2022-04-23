import { addFavourite, load, removeFavourite } from './lib/holidays.actions';

export * from './lib/holidays-data.module';
export const holidaysActions = { load, addFavourite, removeFavourite };
export { fromHolidays } from './lib/holidays.selectors';
