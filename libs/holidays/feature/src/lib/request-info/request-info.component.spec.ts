import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  TestBed,
  TestModuleMetadata,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { asyncScheduler, Observable, scheduled } from 'rxjs';
import { AddressLookuper } from '../address-lookuper.service';
import { RequestInfoComponent } from './request-info.component';
import { RequestInfoComponentHarness } from './request-info.component.harness';
import { RequestInfoComponentModule } from './request-info.component.module';

describe('Request Info Component', () => {
  const setup = (config: TestModuleMetadata = {}) => {
    const lookupMock = jest.fn<Observable<boolean>, [string]>();
    const defaultConfig: TestModuleMetadata = {
      imports: [NoopAnimationsModule, RequestInfoComponentModule],
      providers: [
        {
          provide: AddressLookuper,
          useValue: { lookup: lookupMock },
        },
      ],
    };
    const fixture = TestBed.configureTestingModule({
      ...defaultConfig,
      ...config,
    }).createComponent(RequestInfoComponent);
    lookupMock.mockReset();

    return { fixture, lookupMock };
  };

  it('should find an address with the harness', waitForAsync(async () => {
    const { fixture, lookupMock } = setup();
    lookupMock.mockImplementation((query) =>
      scheduled([query === 'Domgasse 5'], asyncScheduler)
    );

    const harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      RequestInfoComponentHarness
    );

    await harness.writeAddress('Domgasse 15');
    await harness.search();
    expect(await harness.getResult()).toBe('Address not found');

    await harness.writeAddress('Domgasse 5');
    await harness.search();
    expect(await harness.getResult()).toBe('Brochure sent');
  }));
});
