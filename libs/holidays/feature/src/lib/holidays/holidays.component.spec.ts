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
import { Configuration } from '@eternal/shared/config';
import { createHolidays } from '@eternal/holidays/model';
import { HolidaysDataModule } from '@eternal/holidays/data';

describe('Request Info Component', () => {
  const setup = async () =>
    render(HolidaysComponent, {
      imports: [
        HolidaysComponentModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        HolidaysDataModule,
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

  it('should show holiday cards', fakeAsync(async () => {
    await setup();
    const controller = TestBed.inject(HttpTestingController);
    const holidays = createHolidays({ title: 'Vienna' }, { title: 'London' });
    controller.expectOne((req) => !!req.url.match(/holiday/)).flush(holidays);

    await screen.findByText('Vienna');
    await screen.findByText('London');
  }));
});
