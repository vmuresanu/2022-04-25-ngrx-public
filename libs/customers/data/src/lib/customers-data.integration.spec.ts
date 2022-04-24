import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CustomersDataModule } from './customers-data.module';
import { CustomersRepository } from './customers-repository.service';
import { Router } from '@angular/router';
import { provideMock } from '@testing-library/angular/jest-utils';
import { Configuration } from '@eternal/shared/config';
import { MatDialogModule } from '@angular/material/dialog';
import { createCustomers } from '@eternal/customers/model';
import { firstValueFrom } from 'rxjs';

describe('Customers Data', () => {
  const setup = () => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        HttpClientTestingModule,
        CustomersDataModule,
        MatDialogModule,
      ],
      providers: [
        provideMock(Router),
        {
          provide: Configuration,
          useValue: new Configuration('https:///www.host.com'),
        },
      ],
    });

    const repository = TestBed.inject(CustomersRepository);
    const httpCtrl = TestBed.inject(HttpTestingController);

    return { repository, httpCtrl };
  };

  it('should instantiate', () => {
    setup();
  });

  it('should load customers', async () => {
    const { repository, httpCtrl } = setup();
    const customers = createCustomers({}, {});

    repository.get(1);
    httpCtrl
      .expectOne('/customers?page=1')
      .flush({ content: customers, page: 1, total: 30 });
    const pagedCustomers = await firstValueFrom(repository.pagedCustomers$);

    expect(pagedCustomers).toEqual({
      customers: customers.map((customer) => ({
        ...customer,
        selected: false,
      })),
      page: 1,
      total: 30,
    });
  });

  it('should show an error', async () => {
    const { repository, httpCtrl } = setup();

    repository.get(-1);
    httpCtrl
      .expectOne('/customers?page=-1')
      .flush('', { status: 502, statusText: 'Bad Gateway' });
    const pagedCustomers = await firstValueFrom(repository.pagedCustomers$);

    expect(pagedCustomers).toEqual({
      customers: [],
      page: -1,
      total: 0,
    });
    expect(await firstValueFrom(repository.hasError$)).toBe(true);
  });
});
