import { fakeAsync, TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HolidaysComponent } from './holidays.component';
import { HolidaysComponentModule } from './holidays.component.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { holidaysFeature } from '../+state/holidays.reducer';
import { HolidaysEffects } from '../+state/holidays.effects';
import { Configuration } from '@eternal/shared/config';

const ui = {
  address: () => screen.getByTestId('address'),
  search: () => screen.getByTestId('btn-search'),
  message: () => screen.getByTestId('lookup-result'),
};

const mockLookup = (query: string, response: unknown[]) => {
  const controller = TestBed.inject(HttpTestingController);
  controller
    .expectOne((req) => {
      return !!req.url.match(/nominatim/) && req.params.get('q') === query;
    })
    .flush(response);
};

describe('Request Info Component', () => {
  const setup = async () =>
    render(HolidaysComponent, {
      imports: [
        HolidaysComponentModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        StoreModule.forFeature(holidaysFeature),
        EffectsModule.forFeature([HolidaysEffects]),
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: Configuration,
          useValue: {
            baseUrl: 'http://localhost:8080/',
          },
        },
      ],
      excludeComponentDeclaration: true,
    });

  it('should instantiate', fakeAsync(async () => {
    await setup();
    await screen.findByText('Choose among our Holidays');
  }));
});
