import { HolidaysState } from './holidays.reducer';
import { createHolidays } from '@eternal/holidays/model';
import { fromHolidays } from './holidays.selectors';

it('should select the holidays with ids and titles', () => {
  const state: HolidaysState = {
    holidays: createHolidays({ title: 'Pyramids' }, { title: 'Tower Bridge' }),
    favouriteIds: [],
    loadStatus: 'not loaded',
  };

  expect(fromHolidays.selectIdTitles.projector(state.holidays)).toEqual([
    { id: 1, title: 'Pyramids' },
    { id: 2, title: 'Tower Bridge' },
  ]);
});
