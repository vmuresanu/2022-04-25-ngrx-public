- [1. Caching](#1-caching)
  - [1.1. Optional: Full Cache for Holidays](#11-optional-full-cache-for-holidays)
  - [1.2. Partial Cache for Customers](#12-partial-cache-for-customers)
- [2. Error Handling](#2-error-handling)
  - [2.1 Verify Blocking](#21-verify-blocking)
  - [2.2. safeSwitchMap](#22-safeswitchmap)
  - [2.3. Optional: Error State](#23-optional-error-state)
- [3. Deferred Actions](#3-deferred-actions)
  - [3.1 Redirect and show message on updating](#31-redirect-and-show-message-on-updating)
  - [3.2 Optional: Disabled Submit Button](#32-optional-disabled-submit-button)
- [4. Dependent Feature States](#4-dependent-feature-states)
  - [4.1 Active Dependency in `bookings`](#41-active-dependency-in-bookings)
  - [4.2 Optional: `bookings` as sub-module of `customers`](#42-optional-bookings-as-sub-module-of-customers)
  - [4.3. Optional: Route as single-source of truth](#43-optional-route-as-single-source-of-truth)
- [5. Bonus](#5-bonus)
  - [5.1 Search Filters for Customers](#51-search-filters-for-customers)

# 1. Caching

## 1.1. Optional: Full Cache for Holidays

Implement a full cache for the holidays feature.

---

**1. `loadStatus` property in `State`**

Update the `HolidaysState`, by adding a further property called `loadStatus`. It should be of type `LoadStatus` which `shared-ngrx-utils` provides. `LoadStatus` is a union type `not loaded | loading | loaded`. The initial value should be `not loaded`.

<details>
<summary>Show Solution</summary>
<p>

_holidays.reducer.ts_

```typescript
export interface HolidaysState {
  holidays: Holiday[];
  favouriteIds: [];
  loadStatus: LoadStatus;
}

const initialState: HolidaysState = { holidays: [], loadStatus: "not loaded" };

// ...
```

</p>
</details>

---

**2. `get` action**

Add a new action `get`. The `HolidaysEffect` should process it and dispatch `load` only then, when the `loadStatus` is set to `not loaded`.

If you have merged before from a solution branch, you also have the `holidays-data`:

1.  In its _index.ts_ you have to expose the `get` action and hide `load`.
2.  You also have to expose a selector for the new `loadStatus` property.

<details>
<summary>Show Solution</summary>
<p>

_holidays.actions.ts_

```typescript
export const get = createAction("[Holidays] Get"):
// ...other actions
```

_holidays.effects.ts_

```typescript
@Injectable()
export class HolidaysEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.get),
      concatLatestFrom(() =>
        this.store.select(holidaysFeature.selectLoadStatus)
      ),
      filter(([, loadStatus]) => loadStatus === "not loaded"),
      map(() => load())
    )
  );

  // ...
}
```

</p>
</details>

---

**3. Modifying `loadStatus`**

The reducer should update the `loadStatus` when the actions `load` and `loaded` are dispatched.

<details>
<summary>Show Solution</summary>
<p>

_holidays.reducer.ts_

```typescript
export const holidaysFeature = createFeature({
  name: "holiday",
  reducer: createReducer(
    initialState,
    on(load, (state) => ({
      ...state,
      loadStatus: "loading",
    })),
    on(loaded, (state, { holidays }) => ({
      ...state,
      loadStatus: "loaded",
      holidays,
    }))
  ),
});
```

</p>
</details>

---

**4. Pre-fetching with `HolidayDataGuard`**

In `holidays-feature`, create a `HolidayDataGuard`, add it to the holiday's root route (you have to change the router config a little bit). The guard should dispatch the `get` action and should return an `Observable` which emits `true` if the `loadStatus` is set to `loaded`.

<details>
<summary>Show Solution</summary>
<p>

_holidays-data.guard.ts_

```typescript
import { CanActivate, UrlTree } from "@angular/router";
import { Injectable } from "@angular/core";
import { fromHolidays, holidaysActions } from "@eternal/holidays/data";
import { Store } from "@ngrx/store";
import { filter, map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HolidaysDataGuard implements CanActivate {
  constructor(private store: Store) {}
  canActivate(): Observable<boolean | UrlTree> {
    this.store.dispatch(holidaysActions.get());
    return this.store.select(fromHolidays.selectLoadStatus).pipe(
      filter((loadStatus) => loadStatus === "loaded"),
      map(() => true)
    );
  }
}
```

_holidays-feature.module.ts_

```typescript
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "",
        canActivate: [HolidaysDataGuard],
        children: [
          {
            path: "",
            component: HolidaysComponent,
          },
          {
            path: "request-info/:holidayId",
            component: RequestInfoComponent,
          },
        ],
      },
    ]),
    // ... other imports
  ],
})
export class HolidaysFeatureModule {}
```

</p>
</details>

---

**5. Simplify `HolidaysComponent`**

`HolidaysComponent` shouldn't dispatch `load` anymore in `ngOnInit`.

<details>
<summary>Show Solution</summary>
<p>

_holidays.component.ts_

```typescript
@Component({
  selector: "eternal-holidays",
  templateUrl: "./holidays.component.html",
  styleUrls: ["./holidays.component.scss"],
})
export class HolidaysComponent {
  holidays$ = this.store.select(fromHolidays.selectHolidaysWithFavourite);

  constructor(private store: Store) {}

  // ...
}
```

</p>
</details>

## 1.2. Partial Cache for Customers

Implement partial cache in customers and use the `page` property in `CustomerState` for the invalidation.

In order to activate pagination, the `CustomersContainerComponent` needs to handle the `switchPage` event of the `CustomersComponent`. Please note, that `CustomerComponent` is zero-based whereas in the state it is not zero-based.

**1. Actions `init` and `get`**

With `init` the `DataGuard` will send a request to initialize (if not already loaded). `get` is a request for a specific page.

<details>
<summary>Show Solution</summary>
<p>

_customers.reducer.ts_

```typescript
export const init = createAction("[Customers] Init");
export const get = createAction("[Customers] Get", props<{ page: number }>());

// ...
```

</p>
</details>

---

**2. Adapt reducer and state**

The `CustomerState` gets a new property `isLoaded` which is set to `false` in the `initialState`. `isLoaded` is set to true when the action `loaded` is dispatched.

We don't need `LoadStatus`, because the content (`page` property) is set in `load`.

<details>
<summary>Show Solution</summary>
<p>

_customers.reducer.ts_

```typescript
export interface CustomersState {
  // ...
  isLoaded: boolean;
}

export const initialState: CustomersState = {
  // ...
  isLoaded: false,
};

export const customersFeature = createFeature({
  name: "customers",
  reducer: createReducer<CustomersState>(
    // ...
    on(load, (state, { page }) => ({
      ...state,
      page,
    })),
    on(loaded, (state, { customers, total }) => ({
      ...state,
      customers,
      total,
      isLoaded: true,
    }))
    // ...
  ),
});
```

</p>
</details>

---

**3. Adapt effects**

The `CustomerEffects` need to handle the `init` and `get` actions properly.

<details>
<summary>Show Solution</summary>
<p>

_customers.effects.ts_

```typescript
@Injectable()
export class CustomersEffects {
  #baseUrl = "/customers";

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(init),
      concatLatestFrom(() =>
        this.store.select(customersFeature.selectIsLoaded)
      ),
      filter(([, isLoaded]) => isLoaded === false),
      map(() => get({ page: 1 }))
    )
  );

  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(get),
      concatLatestFrom(() => this.store.select(customersFeature.selectPage)),
      filter(([action, page]) => action.page !== page),
      map(([{ page }]) => load({ page }))
    )
  );

  //...
}
```

</p>
</details>

---

**4. Adapt Repository**

And for everybody outside of NgRx, we have to expose the new changes as well.

The `CustomersRepository` could optionally rename `load` to `get` (not really required). Either way, inside `get/load` it needs to dispatch the `get` action and it also offers a new method `init`.

<details>
<summary>Show Solution</summary>
<p>

_customers-repository.service.ts_

```typescript
@Injectable({ providedIn: "root" })
export class CustomersRepository {
  // ...

  constructor(private store: Store) {}

  init(): void {
    this.store.dispatch(customersActions.init());
  }

  get(page: number): void {
    this.store.dispatch(customersActions.get({ page }));
  }

  // ...
}
```

</p>
</details>

---

**5. Minor changes in `ContainerComponent` and `DataGuard` of `customers-feature`**

Now adapt the new changes to the `DataGuard` and `ContainerComponent`. The guard needs to dispatch `init` and the container component needs dispatch when the user paginates.

<details>
<summary>Show Solution</summary>
<p>

_customers-container.component.ts_

```typescript
export class CustomersContainerComponent {
  // ...

  switchPage(page: number) {
    this.customersRepository.get(page + 1);
  }
}
```

_data-guard.ts_

```typescript
export class DataGuard implements CanActivate {
  constructor(private customersRepository: CustomersRepository) {}

  canActivate(): boolean {
    this.customersRepository.init();
    return true;
  }
}
```

</p>
</details>

# 2. Error Handling

## 2.1 Verify Blocking

Verify that NgRx takes care of error handling automatically. Go to customers, go offline (DevTools, Network tab), switch the page, the list shouldn't change. Go back online and verify that switching pages works.

Verify that the `catchError` operator does more damage than good. Add it at the end of `CustomerEffects::load$` piping:

_customers.effect.ts_

```typescript
load$ = createEffect(() =>
  this.actions$.pipe(
    ofType(load),
    switchMap(({ page }) =>
      this.http
        .get<{ content: Customer[]; total: number }>(this.#baseUrl, {
          params: new HttpParams().set("page", page),
        })
        .pipe(
          map(({ content, total }) =>
            loaded({ customers: content, total, page })
          )
        )
    ),
    catchError(() => of(noopAction()))
  )
);
```

If you repeat the steps again, you will see that the application is not working in online mode anymore.

Remove the `catchError` again.

## 2.2. safeSwitchMap

Let's come up with a `safeSwitchMap` operator. It should work like `safeConcatMap` in `shared-ngrx-utils` but should - of course - call the `switchMap`.

Apply it to `CustomerEffects::load$`.

<details>
<summary>Show Solution</summary>
<p>

`shared-ngrx-utils`: _safe-switch-map.ts_

```typescript
import { TypedAction } from "@ngrx/store/src/models";
import { catchError, Observable, of, OperatorFunction, switchMap } from "rxjs";
import { noopAction } from "./noop.action";

export function safeSwitchMap<S, T extends string>(
  project: (value: S) => Observable<TypedAction<T>>
): OperatorFunction<S, TypedAction<T | "NOOP">> {
  return (source$: Observable<S>): Observable<TypedAction<T | "NOOP">> =>
    source$.pipe(
      switchMap((value) =>
        project(value).pipe(catchError(() => of(noopAction())))
      )
    );
}
```

Expose it `shared-ngrx-utils`, _index.ts_.

_customers.effect.ts_

```typescript
load$ = createEffect(() =>
  this.actions$.pipe(
    ofType(load),
    safeSwitchMap(({ page }) =>
      this.http
        .get<{ content: Customer[]; total: number }>(this.#baseUrl, {
          params: new HttpParams().set("page", page),
        })
        .pipe(
          map(({ content, total }) =>
            loaded({ customers: content, total, page })
          )
        )
    )
  )
);
```

</p>
</details>

## 2.3. Optional: Error State

Extend the `CustomersState` with a new property `hasError`. You hopefully agree that it's initial value is `false`. 😉

Add a second, optional parameter to the `safeSwitchMap`. It should be a function returning an action which is dispatched in case of an error. By default, it is the `noopAction`.

If the `CustomersState` is in "error state", the `CustomersRootComponent` should show a confirmation dialog that the feature customers is not available at the moment and should redirect to home. Use `MessageService::confirm` from `shared-ui-messaging` for the confirmation dialog.

**1. `loadFailure` and `loadSuccess` actions**

Create a new action `loadFailure` and optionally rename `loaded` to `loadSuccess`.

<details>
<summary>Show Solution</summary>
<p>

_customers.actions.ts_

```typescript
export const loadSuccess = createAction(
  // <- rename from loaded
  "[Customers] Load Success",
  props<{ customers: Customer[]; total: number; page: number }>()
);

export const loadFailure = createAction("[Customers] Load Failure");
```

</p>
</details>

**`safeSwitchMap` with `loadFailure`**

Our `safeSwitchMap` should allow a fallback function:

```typescript
export function safeSwitchMap<S, T extends string, U extends string>(
  project: (value: S) => Observable<TypedAction<T>>,
  errorAction?: (err: Error) => TypedAction<U>
): OperatorFunction<S, TypedAction<T | U | "NOOP">> {
  return (source$: Observable<S>): Observable<TypedAction<T | U | "NOOP">> =>
    source$.pipe(
      switchMap((value) =>
        project(value).pipe(
          catchError((err) => of(errorAction?.(err) ?? noopAction()))
        )
      )
    );
}
```

In effects, the `safeSwitchMap` should dispatch `loadFailure` in the event of an error.

<details>
<summary>Show Solution</summary>
<p>

_customers.effects.ts_

```typescript
@Injectable()
export class CustomersEffects {
  // ...

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(load),
      safeSwitchMap(
        ({ page }) =>
          this.http
            .get<{ content: Customer[]; total: number }>(this.#baseUrl, {
              params: new HttpParams().set("page", page),
            })
            .pipe(
              map(({ content, total }) =>
                loadSuccess({ customers: content, total, page })
              )
            ),
        () => loadFailure() // <- this is new
      )
    )
  );
}
```

</p>
</details>

**3. add error to state**

In case of `loadFailure`, `hasError` must be set to `true`. Further more, the `init` method should check, if the state is in error mode and, should set the initalState. In that way, it would be a full reset.

<details>
<summary>Show Solution</summary>
<p>

_customers.reducer.ts_

```typescript
export interface CustomersState {
  // ...
  hasError: boolean;
}

export const initialState: CustomersState = {
  // ...
  hasError: false,
};

export const customersFeature = createFeature({
  name: "customers",
  reducer: createReducer<CustomersState>(
    initialState,
    on(init, (state) => {
      if (state.hasError) {
        return initialState;
      }
      return state;
    }),
    on(loadFailure, (state) => ({
      ...state,
      hasError: true,
    }))
    // ...
  ),
});
```

</p>
</details>

**4. Expose `hasError`**

Expose the `hasError` property via the `CustomersRepository´.

<details>
<summary>Show Solution</summary>
<p>

_customers-repository.services.ts_

```typescript
export class CustomersRepository {
  // ...

  readonly hasError$: Observable<boolean> = this.store.select(
    customersFeature.selectHasError
  );

  // ...
}
```

</p>
</details>

**5. Dealing with the error**

The `CustomerRootComponent` should do the redirection, if `hasError` is set to ´true` and should show the confirmation message.

<details>
<summary>Show Solution</summary>
<p>

_customer-root.component.ts_

```typescript
@Component({
  templateUrl: "./customers-root.component.html",
})
export class CustomersRootComponent {
  constructor(
    customersRepository: CustomersRepository,
    router: Router,
    messageService: MessageService
  ) {
    customersRepository.hasError$.pipe(first(Boolean)).subscribe(() => {
      router.navigateByUrl("/");
      messageService.confirm(
        "Sorry, but Customers are not available at the moment.<br>Please try again later."
      );
    });
  }
}
// ...
```

</p>
</details>

# 3. Deferred Actions

## 3.1 Redirect and show message on updating

Upgrade the `update` action in `customers-data` so that it has parameters for the forward url and a message that should be shown.

<details>
<summary>Show Solution</summary>
<p>

**1. Modify the `update` action**

_customers.actions.ts_

```typescript
export const update = createAction(
  "[Customers] Update",
  props<{ customer: Customer; forward: string; message: string }>()
);
```

**2. Modify the `update$` property in the effects**

```typescript
update$ = createEffect(() =>
  this.actions$.pipe(
    ofType(update),
    concatMap(({ customer, forward, message }) =>
      this.http.put<Customer[]>(this.#baseUrl, customer).pipe(
        tap(() => this.uiMessage.info(message)),
        tap(() => this.router.navigateByUrl(forward))
      )
    ),
    map(() => load({ page: 1 }))
  )
);
```

**3. Update the `CustomersRepository`**

```typescript
@Injectable({ providedIn: "root" })
export class CustomersRepository {
  // ...

  update(customer: Customer, forward: string, message: string): void {
    this.store.dispatch(
      customersActions.update({ customer, forward, message })
    );
  }
}
```

**4. `EditCustomerComponent`**

_edit-customer.component.ts_

```typescript
export class EditCustomerComponent {
  // ...

  submit(customer: Customer) {
    const urlTree = this.router.createUrlTree(['..'], {
      relativeTo: this.route,
    });
    this.customersRepository.update(
      { ...customer, id: this.customerId },
      urlTree.toString(),
      'Customer has been updated'
    );
  }
```

</p>
</details>

## 3.2 Optional: Disabled Submit Button

Disable the submit button in `EditCustomerComponent` when a network request is ongoing.

This is a use case, where we need to fallback to the most primitive solution: a callback function as parameter of an action.

<details>
<summary>Show Solution</summary>
<p>

**1. `customers-data`**

_customers.actions.ts_

```typescript
export const update = createAction(
  "[Customers] Update",
  props<{
    customer: Customer;
    forward: string;
    message: string;
    callback?: () => void;
  }>()
);
```

_customers.effects.ts_

```typescript
update$ = createEffect(() =>
  this.actions$.pipe(
    ofType(update),
    concatMap(({ customer, forward, message, callback }) =>
      this.http.put<Customer[]>(this.#baseUrl, customer).pipe(
        tap(() => {
          if (callback !== undefined) {
            callback();
          }
        }),
        tap(() => this.uiMessage.info(message)),
        tap(() => this.router.navigateByUrl(forward))
      )
    ),
    map(() => load({ page: 1 }))
  )
);
```

_customers-repository.service.ts_

```typescript
@Injectable({ providedIn: "root" })
export class CustomersRepository {
  // ...
  update(
    customer: Customer,
    forward: string,
    message: string,
    callback?: () => void
  ): void {
    this.store.dispatch(
      customersActions.update({ customer, forward, message, callback })
    );
  }
}
```

**2. Container & Presentational modules**

_edit-customer.component.ts_

```typescript
@Component({
  selector: "eternal-edit-customer",
  template: ` <eternal-customer
    *ngIf="data$ | async as data"
    [customer]="data.customer"
    [countries]="data.countries"
    [disableSubmitButton]="disableSubmitButton"
    (save)="this.submit($event)"
    (remove)="this.remove($event)"
  ></eternal-customer>`,
})
export class EditCustomerComponent {
  data$: Observable<{ customer: Customer; countries: Options }>;
  customerId = 0;
  disableSubmitButton = false; // <- add this property

  // ...

  submit(customer: Customer) {
    const urlTree = this.router.createUrlTree([".."], {
      relativeTo: this.route,
    });
    this.disableSubmitButton = true;
    this.customersRepository.update(
      { ...customer, id: this.customerId },
      urlTree.toString(),
      "Customer has been updated",
      () => (this.disableSubmitButton = true) // <- this is the callback
    );
  }
}
```

You also need to add the property `disableSubmitButton` to `CustomerComponent` and use to disable or enable the submit button.

</p>
</details>

# 4. Dependent Feature States

## 4.1 Active Dependency in `bookings`

We have a bug in booking. When the selected customers changes, the selector updates the name in the `OverviewComponent` but that doesn't apply to the bookings.

This is a bug due an active depdency. Selctors cannot help you with that.

Fix it in `BookingsEffects`.

<details>
<summary>Show Solution</summary>
<p>

_bookings-effects.services.ts_

```typescript
@Injectable()
export class BookingsEffects {
  constructor(private customersApi: CustomersApi) {}

  selectedCustomer$ = createEffect(() =>
    this.customersApi.selectedCustomer$.pipe(
      pluck("id"),
      map((id) => loaded({ bookings: bookings.get(id) || [] }))
    )
  );
}
```

</p>
</details>

## 4.2 Optional: `bookings` as sub-module of `customers`

This is how it should really be done. `Bookings` fully depends on customers and should therefore be a submodule and a sub-root.

This makes sure the application doesn't load `bookings` prior `customers`.

So the new url for `OverviewComponent` should be `/customers/bookings`.

**1. `customers-bookings`**

Move the project `customers` and rename it `customers-bookings`

```bash
npx nx g mv bookings --project-name bookings --destination customers/bookings
```

**2. Lazy-loaded module**

Make `customers-bookings` a lazy-loaded sub module of `customers`.

<details>
<summary>Show Solution</summary>
<p>

Remove the path to `bookings` from the _app-routing.modulets_.

Add `bookings` as subroute in `customers-feature`:

_customers-feature.module.ts_

```typescript
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        canActivate: [DataGuard],
        component: CustomerRootComponent,
        children: [
          {
            path: '',
            component: CustomersContainerComponent,
          },
          {
            path: 'new',
            component: AddCustomerComponent,
            data: { mode: 'new' },
          },
          {
            path: 'bookings',
            loadChildren: () =>
              import('@eternal/customers-bookings').then(
                (m) => m.CustomersBookingsModule
              ),
          },
          {
            path: ':id',
            component: EditCustomerComponent,
            data: { mode: 'edit' },
          },
        ],
      },
    ]),
    // ...
  ]
})
```

Finally, make sure that the link in the sidebar is updated as well.

_sidemenu.component.html_

```html
<li>
  <a
    data-testid="btn-bookings"
    mat-raised-button
    routerLink="/customers/bookings"
    >Customer Bookings</a
  >
</li>
```

</p>
</details>

## 4.3. Optional: Route as single-source of truth

This depends heavily on the UI. We could also see the selected customer id as part of the url.

The url for bookings of customer with ID 1 would then be `/customers/1/bookings`.

The solution would be that we have a guard sitting on the url segment for the ID and that guard would dispatch the `select` action of `customers`.

The customers list wouldn't have the toggle buttons anymore. Bookings would be a direct link.

**Additional Notes**

We have to be careful about the dependency rules here. If `customers-feature` load `customers-bookings` and `customers-bookings` has a dependency to `customers-api`, we might run into a problem.

A solution here is that `customers` becomes `customer-core` and the routing configuration is done in a parent module which is just called `customers`. Then we could get away without a cyclic dependency.

- customers
  - customers-core
    - api
    - feature
    - data
    - ui
    - model
  - customers-bookings

# 5. Bonus

## 5.1 Search Filters for Customers

You can extend the partial cache in customers by adding additional search fields and a sorting functionality. Together with `page`, their values would form the context in `CustomersState`.
