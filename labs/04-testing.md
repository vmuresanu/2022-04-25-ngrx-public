- [1. Unit Tests](#1-unit-tests)
  - [1.1. Reducer](#11-reducer)
  - [1.2. Selector `selectById`](#12-selector-selectbyid)
  - [1.3. Selector `selectSelectedCustomer`](#13-selector-selectselectedcustomer)
  - [1.4. `CustomerEffects:load`](#14-customereffectsload)
  - [1.5. Marble Tests for `load`](#15-marble-tests-for-load)
    - [1.5.1. default mode](#151-default-mode)
    - [1.5.2. no parallel requests](#152-no-parallel-requests)
    - [1.5.3. error handling](#153-error-handling)
- [2. Integration tests](#2-integration-tests)
  - [2.1. Load customers](#21-load-customers)
  - [2.2. Fail loading customers](#22-fail-loading-customers)
- [2. Bonus](#2-bonus)
- [2.1. Redirection in `add`](#21-redirection-in-add)
- [2.2. Improve customers cache by TDD](#22-improve-customers-cache-by-tdd)

# 1. Unit Tests

## 1.1. Reducer

Write two unit tests for the `init` action and verify that there is a change in the state when `hasError` is set to `true`.

<details>
<summary>Show Solution</summary>
<p>

_customers.reducer.spec.ts_

```typescript
describe("Customer Reducer", () => {
  describe("init", () => {
    it("shouldn't do aynthing when state has no error", () => {
      const state = initialState;
      const newState = customersFeature.reducer(state, init());
      expect(state).toBe(newState);
    });

    it("should remove the error when state has an error", () => {
      const state = { ...initialState, hasError: true };
      const newState = customersFeature.reducer(state, init());
      expect(newState.hasError).toBe(false);
    });
  });
});
```

</p>
</details>

## 1.2. Selector `selectById`

Write a unit test for the parameterised selector `selectById`. You can use `createCustomer` to generate a customer entity.

<details>
<summary>Show Solution</summary>
<p>

_customers.selectors.spec.ts_

```typescript
import { fromCustomers } from "./customers.selectors";
import { createCustomer, createCustomers } from "@eternal/customers/model";

describe("Customers Selectors", () => {
  it("should select a customer by id", () => {
    const firstCustomer = createCustomer({ id: 1 });
    const customers = createCustomers(firstCustomer, createCustomer({ id: 2 }));
    expect(fromCustomers.selectById(1).projector(customers)).toEqual(
      firstCustomer
    );
    expect(fromCustomers.selectById(3).projector(customers)).toBeUndefined();
  });
});
```

</p>
</details>

## 1.3. Selector `selectSelectedCustomer`

Next, test the selector `selectSelectedCustomer`. You can pass multiple values to the `projector` function of a selector.

<details>
<summary>Show Solution</summary>
<p>

_customers.selectors.spec.ts_

```typescript
it("should select selected customer", () => {
  const tanjaLudwig = createCustomer({
    id: 2,
    firstname: "Tanja",
    name: "Ludwig",
  });
  const customers = createCustomers(createCustomer({ id: 1 }), tanjaLudwig);
  expect(fromCustomers.selectSelectedCustomer.projector(customers, 2)).toEqual(
    tanjaLudwig
  );
});
```

</p>
</details>

## 1.4. `CustomerEffects:load`

Write a test for the `CustomerEffects` that verify that no network is sent on `init` where the customers are already loaded.

Write another one for the opposite case, i.e. the effect should dispatch the `get` action.

<details>
<summary>Show Solution</summary>
<p>

_customers.effects.spec.ts_

```typescript
import { Action, Store } from "@ngrx/store";
import { customersFeature } from "./customers.reducer";
import { firstValueFrom, Observable, of } from "rxjs";
import { CustomersEffects } from "./customers.effects";
import * as customersActions from "./customers.actions";
import { createMock, Mock } from "@testing-library/angular/jest-utils";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Configuration } from "@eternal/shared/config";
import { MessageService } from "@eternal/shared/ui-messaging";

describe("Customer Effects", () => {
  let httpClient: Mock<HttpClient>;
  let store: Mock<Store>;
  let configuration: Mock<Configuration>;
  let router: Mock<Router>;
  let messageService: Mock<MessageService>;

  beforeEach(() => {
    httpClient = createMock(HttpClient);
    store = createMock(Store);
    configuration = createMock(Configuration);
    router = createMock(Router);
    messageService = createMock(MessageService);
  });

  const createEffect = (actions$: Observable<Action>) =>
    new CustomersEffects(
      actions$,
      httpClient,
      router,
      store,
      configuration,
      messageService
    );

  describe("init", () => {
    it("should  dispatch get if not loaded", async () => {
      store.select.mockImplementation((selector) => {
        expect(selector).toBe(customersFeature.selectIsLoaded);
        return of(false);
      });

      const actions$ = of(customersActions.init());
      const effect = createEffect(actions$);
      expect(await firstValueFrom(effect.init$)).toEqual(
        customersActions.get({ page: 1 })
      );
    });

    it("should dispatch nothing if already loaded", async () => {
      store.select.mockImplementation((selector) => {
        expect(selector).toBe(customersFeature.selectIsLoaded);
        return of(true);
      });

      const actions$ = of(customersActions.init());
      const effect = createEffect(actions$);

      await expect(firstValueFrom(effect.init$)).rejects.toThrow();
    });
  });
});
```

</p>
</details>

## 1.5. Marble Tests for `load`

### 1.5.1. default mode

Write a test for the `load` action in the `CustomersEffects` that mocks the `HttpClient` and asserts, that the `loadSuccess` action is dispatched.

<details>
<summary>Show Solution</summary>
<p>

_customers.effects.spec.ts_

```typescript
it(
  "should load with the right parameters",
  marbles((m) => {
    const actions$ = m.cold("---a", {
      a: customersActions.load({ page: 2 }),
    });
    const customer = createCustomer();
    httpClient.get.mockImplementation((url, { params }) => {
      expect(url).toBe("/customers");
      expect(params).toEqual(new HttpParams().set("page", 2));
      return m.cold("r", { r: { content: [customer], total: 11 } });
    });
    const effect = createEffect(actions$);

    m.expect(effect.load$).toBeObservable("---b", {
      b: customersActions.loadSuccess({
        customers: [customer],
        total: 11,
        page: 2,
      }),
    });
  })
);
```

</p>
</details>

### 1.5.2. no parallel requests

We use `switchMap` for the HTTP request. This means that running HTTP requests are cancelled when the ´load` action is triggerd a second time..

Write a test, where `load` is dispatched three times, with a delay of 100ms in-between. The http request should take 200ms. At the end, we should only have one dispatched `loadSuccess` action.

<details>
<summary>Show Solution</summary>
<p>

_customers.effects.spec.ts_

```typescript
it(
  "should not load in parallel",
  marbles((m) => {
    const actions$ = m.cold("100ms a 100ms b 100ms c", {
      a: customersActions.load({ page: 1 }),
      b: customersActions.load({ page: 2 }),
      c: customersActions.load({ page: 3 }),
    });

    const customers = [
      createCustomer(),
      createCustomer(),
      createCustomer({ firstname: "User 3" }),
    ].reverse();
    const [lastCustomer] = customers;

    httpClient.get.mockImplementation(() => {
      return m.cold("200ms r", {
        r: { content: [customers.pop()], total: 20 },
      });
    });

    const effect = createEffect(actions$);

    m.expect(effect.load$).toBeObservable("502ms b", {
      b: customersActions.loadSuccess({
        customers: [lastCustomer],
        total: 20,
        page: 3,
      }),
    });
  })
);
```

</p>
</details>

### 1.5.3. error handling

Finally, let's check if the `loadFailure` action is dispatched when an error happens.

The syntax for the `httpClient` would be:

```typescript
httpClient.get.mockImplementation(() => {
  return m.cold("#", {}, new Error());
});
```

<details>
<summary>Show Solution</summary>
<p>

_customers.effects.spec.ts_

```typescript
it(
  "should dispatch loadFailure on error",
  marbles((m) => {
    const actions$ = m.cold("l", {
      l: customersActions.load({ page: 1 }),
    });
    httpClient.get.mockImplementation(() => {
      return m.cold("#", {}, new Error());
    });

    const effect = createEffect(actions$);

    m.expect(effect.load$).toBeObservable("a", {
      a: customersActions.loadFailure(),
    });
  })
);
```

</p>
</details>

# 2. Integration tests

Integration tests are much slower than unit tests but have a higher coverage.

We write one test file which covers the complete `customers-data` module and uses its API, the `CustomersRepository`.

In `customers-data`, create a new file `customers-data.integration.spec.ts` and add following code to it:

```typescript
import { TestBed } from "@angular/core/testing";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import {
  CustomersDataModule,
  CustomersRepository,
} from "@eternal/customers/data";
import { Router } from "@angular/router";
import { provideMock } from "@testing-library/angular/jest-utils";
import { Configuration } from "@eternal/shared/config";
import { MatDialogModule } from "@angular/material/dialog";
import { firstValueFrom } from "rxjs";
import { createCustomers } from "@eternal/customers/model";

describe("Customers Data", () => {
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
          useValue: new Configuration("https:///www.host.com"),
        },
      ],
    });

    const repository = TestBed.inject(CustomersRepository);
    const httpCtrl = TestBed.inject(HttpTestingController);

    return { repository, httpCtrl };
  };

  it("should instantiate", () => {
    setup();
  });
});
```

Make sure it turns green.

## 2.1. Load customers

Add a test that calls `CustomersRepository:get` and assert the `pagedCustomers$`.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it("should load customers", async () => {
  const { repository, httpCtrl } = setup();
  const customers = createCustomers({}, {});

  repository.get(1);
  httpCtrl
    .expectOne("/customers?page=1")
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
```

</p>
</details>

## 2.2. Fail loading customers

Simulate a failed HTTP request. You can trigger an HTTP error via `httpCtrl.expectOne('/customers?page=-1').flush('', { status: 502, statusText: 'Bad Gateway' });`.

<details>
<summary>Show Solution</summary>
<p>

```typescript
it("should show an error", async () => {
  const { repository, httpCtrl } = setup();

  repository.get(-1);
  httpCtrl
    .expectOne("/customers?page=-1")
    .flush("", { status: 502, statusText: "Bad Gateway" });
  const pagedCustomers = await firstValueFrom(repository.pagedCustomers$);

  expect(pagedCustomers).toEqual({
    customers: [],
    page: -1,
    total: 0,
  });
  expect(await firstValueFrom(repository.hasError$)).toBe(true);
});
```

</p>
</details>

# 2. Bonus

# 2.1. Redirection in `add`

Write a marble test, that asserts that a redirection happens in the handling of the `add` action.

<details>
<summary>Show Solution</summary>
<p>

_customers.effects.spec.ts_

```typescript
describe("add$", () => {
  it("should redirect to /customers", () => {
    const actions$ = of(customersActions.add({ customer: createCustomer() }));
    const effect = createEffect(actions$);
    httpClient.post.mockReturnValue(of(true));

    effect.add$.subscribe();

    expect(router.navigateByUrl).toHaveBeenCalledWith("/customers");
  });
});
```

</p>
</details>

```typescript
it("should load holidays", async () => {
  const holidays = createHolidays(
    { title: "Pyramids" },
    { title: "Tower Bridge" }
  );

  store.dispatch(get());
  httpCtrl.expectOne("/holiday").flush(holidays);

  expect(await firstValueFrom(store.select(fromHolidays.get))).toEqual(
    holidays.map((holiday) => ({
      ...holiday,
      imageUrl: `https://www.host.com/${holiday.imageUrl}`,
    }))
  );
  httpCtrl.verify(); // no outstanding http requests
});
```

# 2.2. Improve customers cache by TDD

If we dispatch `get` with page 0, then no request is sent. This is because, the default page value is 0. You have a working integration test "should show an error" in _customers-data.integration.spec.ts_. Update that test, so that page is 0 instead of -1 and make sure that the loading takes place.
