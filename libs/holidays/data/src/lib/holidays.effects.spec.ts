import { HttpClient } from '@angular/common/http';
import { HolidaysEffects } from './holidays.effects';
import { Configuration } from '@eternal/shared/config';
import { load, loaded } from './holidays.actions';
import { Actions } from '@ngrx/effects';
import { firstValueFrom, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { createHolidays } from '@eternal/holidays/model';
import { createMock, Mock } from '@testing-library/angular/jest-utils';
import { marbles } from 'rxjs-marbles/jest';

describe('Holidays Effects', () => {
  let httpClient: Mock<HttpClient>;
  const config = new Configuration('https://www.host.com/');
  let store: Mock<Store>;

  beforeEach(() => {
    httpClient = createMock(HttpClient);
    store = createMock(Store);
  });

  const createEffect = (actions$: Actions) =>
    new HolidaysEffects(actions$, httpClient, config, store);

  it('should load holidays', async () => {
    const holidays = createHolidays(
      { imageUrl: 'pyramids.jpg' },
      { imageUrl: 'tower-bridge.jpg' }
    );
    httpClient.get.mockReturnValue(of(holidays));
    const effects = createEffect(of(load));

    expect(await firstValueFrom(effects.load$)).toEqual(
      loaded({
        holidays: holidays.map((holiday) => ({
          ...holiday,
          imageUrl: `https://www.host.com/${holiday.imageUrl}`,
        })),
      })
    );
  });

  it(
    'should load holidays with rxjs-marbles',
    marbles((m) => {
      const holidays = createHolidays(
        { imageUrl: 'pyramids.jpg' },
        { imageUrl: 'tower-bridge.jpg' }
      );
      httpClient.get.mockReturnValue(m.cold('250ms h', { h: holidays }));

      const effects = createEffect(m.cold('500ms l', { l: load() }));

      m.expect(effects.load$).toBeObservable('750ms r', {
        r: loaded({
          holidays: holidays.map((holiday) => ({
            ...holiday,
            imageUrl: `https://www.host.com/${holiday.imageUrl}`,
          })),
        }),
      });
    })
  );
});
