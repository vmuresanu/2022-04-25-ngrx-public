- [1. Immutability with `ngrx-immer`](#1-immutability-with-ngrx-immer)
- [2. Local Storage with `ngrx-store-localstorage`](#2-local-storage-with-ngrx-store-localstorage)
  - [2.1. Basic setup](#21-basic-setup)
  - [2.2. Rehydration](#22-rehydration)
  - [2.3. Tab synchronization](#23-tab-synchronization)
- [3. undo & redo with `ngrx-wieder`](#3-undo--redo-with-ngrx-wieder)
  - [3.1. Setup](#31-setup)
  - [3.2. UI](#32-ui)
  - [3.3. Limit to customers selection](#33-limit-to-customers-selection)
- [4. Optimistic Updates with nx's DataPersistence](#4-optimistic-updates-with-nxs-datapersistence)

# 1. Immutability with `ngrx-immer`

Apply `ngrx-immer` to the holidays reducer.

After you're done, run the tests to verify everything is working as before.

<details>
<summary>Show Solution</summary>
<p>

_customers.reducer.ts_

```typescript
createReducer<CustomersState>(
  initialState,
  immerOn(init, (state) => {
    if (state.hasError) {
      // This will not work: state = initialState;
      safeAssign(state, initialState);
    }
  }),
  immerOn(load, (state, { page }) => {
    state.page = page;
  }),
  immerOn(loadSuccess, (state, { customers, total }) => {
    safeAssign(state, {
      customers,
      total,
      isLoaded: true,
      hasError: false,
    });
  }),
  immerOn(loadFailure, (state) => {
    state.hasError = true;
  }),
  immerOn(select, (state, { id }) => {
    state.selectedId = id;
  }),
  immerOn(unselect, (state) => {
    state.selectedId = undefined;
  })
);
```

</p>
</details>

# 2. Local Storage with `ngrx-store-localstorage`

## 2.1. Basic setup

We want to use the local storage for rehydration and tab synchronisation.

**1. `core-local-storage-data`**

Let's create an own library for that

```bash
npx nx g lib local-storage-state --directory core --tags "domain:core" --skip-module
```

We don't have an `NgMdule` in this library, so create the lib folder manually.

---

**2. Syncing `customers-data`**

In `core-local-storage-state`, create a the file _local-storage-reducer.ts_ and add the following code:

```typescript
import { ActionReducer } from "@ngrx/store";
import { localStorageSync } from "ngrx-store-localstorage";

const syncerFn = localStorageSync({ keys: ["customers"] });

export const localStorageReducer =
  <S>(reducer: ActionReducer<S>): ActionReducer<S> =>
  (state, action) =>
    syncerFn(reducer)(state, action);
```

Make sure that this is also export in the `index.ts` of the library.

In _app.module.ts_, add this functions as metareducer:

```typescript
@NgModule({
  imports: [
    // ...
    StoreModule.forRoot({}, { metaReducers: [localStorageReducer] }),
    // ...
  ],
  // ...
})
export class AppModule {}
```

Start the application and make sure that your `localStorage` has an entry for `customers`.

---

**3. Factory function**

We don't want that the features names are known to `core-local-storage-state`. It is acceptable, if the `AppModule` knows them. So let's change that.

_local-storage-reducer.ts_

```typescript
export const localStorageReducer = (...featureStateNames: string[]) => {
  const syncerFn = localStorageSync({ keys: featureStateNames });

  return <S>(reducer: ActionReducer<S>): ActionReducer<S> =>
    (state, action) =>
      syncerFn(reducer)(state, action);
};
```

_app.module.ts_

```typescript
@NgModule({
  imports: [
    // ...
    StoreModule.forRoot(
      {},
      { metaReducers: [localStorageReducer("customers")] }
    ),
    // ...
  ],
  // ...
})
export class AppModule {}
```

## 2.2. Rehydration

Let's add the states `holidays`, `security`, and `master` as well and enable rehydration.

_app.module.ts_

```typescript
@NgModule({
  imports: [
    // ...
    StoreModule.forRoot(
      {},
      {
        metaReducers: [
          localStorageReducer("customers", "holidays", "security", "master"),
        ],
      }
    ),
    // ...
  ],
  // ...
})
export class AppModule {}
```

_local-storage-reducer.ts_

```typescript
export const localStorageReducer = (...featureStateNames: string[]) => {
  const syncerFn = localStorageSync({
    keys: featureStateNames,
    rehydrate: true,
  });

  // ...
};
```

1. Open the application, click on holidays and on customers.
2. Reload the application and click again on holidays and customers. You should see that no network requests are done because the state kept its data from the former session.

## 2.3. Tab synchronization

**1. Actions & Effects**

Let's enable support for multi-tab synchronization in `core-local-storage-state`.

First, we have to create an `Action` when there is a change in the local storage.

_sync-local-storage.ts_

```typescript
export const syncLocalStorage = createAction(
  "[Core] Sync Local Store",
  props<{ featureState: string }>()
);
```

Then, we have to listen for changes in the local storage. We do that in our `core-local-storage-state`.

Next, we create and expose and effect which dispatches `syncLocalStorage`.

_local-storage-effects.ts_

```typescript
@Injectable()
export class LocalStorageEffects {
  storageEvent = createEffect(() =>
    fromEvent<StorageEvent>(window, "storage").pipe(
      pluck("key"),
      filterDefined,
      map((featureState) => syncLocalStorage({ featureState }))
    )
  );
}
```

Expose `LocalStorageEffects` in the _index.ts_ and activate it in the `AppModule`.

_app.module_

```typescript
@NgModule({
  imports: [
    // ...
    EffectsModule.forRoot([LocalStorageEffects]),
    // ...
  ],
  // ...
})
export class AppModule {}
```

---

**2. Sync in the metaReducer**

In our meta reducer, we need to distinguish between `syncLocalStorage` and the other actions. In order, to make it type-safe, we create a type guard function.

_is-sync-local-storage_

```typescript
export function isSyncLocalStorage(
  action: Action
): action is ReturnType<typeof syncLocalStorage> {
  return action.type === syncLocalStorage.type;
}
```

Back in the meta reducer, we add the condition and sync the feature state from the local storage.

_local-storage-reducer.ts_

```typescript
export const localStorageReducer = (...featureStateNames: string[]) => {
  // ...

  return <S>(reducer: ActionReducer<S>): ActionReducer<S> =>
    (state, action) => {
      if (isSyncLocalStorage(action)) {
        const rehydratedFeatureState = rehydrateApplicationState(
          [action.featureState],
          localStorage,
          (value) => value,
          true
        );
        return { ...state, ...rehydratedFeatureState };
      }
      return syncerFn(reducer)(state, action);
    };
};
```

---

**3. Verify synchronization**

Open two tabs in the browser, go to customers. Select a customer and make sure that it is also selected in the other one.

**4. Fix linting**

We have introduced a new type of module. It is not shared because App uses it and it is also not a feature module.

A pragmatic approach here is, that we define `core-local-storage-state` as `domain:core` and skip assigning a type to it.

We have to update the constraints for `type:app` and new ones for `domain:core`.

Updates _.eslintrc.json_:

```json
{
  "sourceTag": "type:app",
  "onlyDependOnLibsWithTags": [
    "domain:core",
    "type:feature",
    "type:shared:config",
    "type:shared:http",
    "type:shared:master-data",
    "type:shared:security",
    "type:shared:ui-messaging"
  ]
}
```

```json
{
  "sourceTag": "domain:core",
  "onlyDependsOnLibsWithTags": "domain:shared"
}
```

# 3. undo & redo with `ngrx-wieder`

First,you want to disable the meta reducers for the local storage. Adding new feature against an active cache is not always a good idea.

---

We will apply redo / undo for customers and then limit it to the selected customer feature only.

## 3.1. Setup

**1. New actions**

Add two new actions.

_customers.actions.ts_

```typescript
export const undo = createAction("[Customers] Undo");
export const redo = createAction("[Customers] Redo");
```

---

**2. Extending `CustomersState`**

Open _customers.reducer.ts_ and

- extend the `CustomersState`,

```typescript
export interface CustomersState extends UndoRedoState {
  // leave the properties as they are
}
```

- modify the `initialState`, and

```typescript
export const initialState: CustomersState = {
  // properties as they are
  ...initialUndoRedoState, // <- add this from ngrx-wieder
};
```

- use the undoRedo reducer

```typescript
const { createUndoRedoReducer } = undoRedo({
  undoActionType: undo.type,
  redoActionType: redo.type,
});

export const customersFeature = createFeature({
  name: 'customers',
  reducer: createUndoRedoReducer<CustomersState>( // <- use the new reducer
    initialState,
    immerOn(init, (state) => {
      if (state.hasError) {
        safeAssign(state, initialState);
      }
    }),
});
```

---

**3. Selectors for undo & rendo**

Add selectors that tell us, if undo or redo operations are available.

_customers.selectors_ts_

```typescript
const { selectCanRedo, selectCanUndo } = createHistorySelectors(
  customersFeature.selectCustomersState
);

export const fromCustomers = {
  // ...
  selectCanUndo,
  selectCanRedo,
};
```

---

**4. Expose selectors and undo/redo actions**

_customers.repository.ts_

```typescript
@Injectable({ providedIn: "root" })
export class CustomersRepository {
  // ...

  readonly canUndo$: Observable<boolean> = this.store.select(
    fromCustomers.selectCanUndo()
  );
  readonly canRedo$: Observable<boolean> = this.store.select(
    fromCustomers.selectCanRedo()
  );

  // ...

  undo(): void {
    this.store.dispatch(customersActions.undo());
  }
  redo(): void {
    this.store.dispatch(customersActions.redo());
  }
}
```

## 3.2. UI

We add the buttons for undo/redo in the `CustomersRootComponent`. This component is the top-level component of the customers module. Therefore the buttons will always be displayed.

Just copy the contents shown below into the quoted files.

_customers-root.component.ts_

```typescript
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CustomersRepository } from "@eternal/customers/data";
import { MessageService } from "@eternal/shared/ui-messaging";
import { first } from "rxjs";

@Component({
  templateUrl: "./customers-root.component.html",
})
export class CustomersRootComponent {
  constructor(
    public customersRepository: CustomersRepository,
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

  handleUndo() {
    this.customersRepository.undo();
  }

  handleRedo() {
    this.customersRepository.redo();
  }
}
```

_customers-root.component.html_

```html
<div class="w-36 flex justify-between">
  <button
    *ngrxLet="customersRepository.canUndo$ as undo"
    mat-raised-button
    class="mr-4"
    (click)="handleUndo()"
    [disabled]="!undo"
  >
    <mat-icon>undo</mat-icon>
  </button>
  <button
    *ngrxLet="customersRepository.canRedo$ as redo"
    mat-raised-button
    (click)="handleRedo()"
    [disabled]="!redo"
  >
    <mat-icon>redo</mat-icon>
  </button>
</div>
<router-outlet></router-outlet>
```

_customers-root.component.ts_

```typescript
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ReactiveComponentModule } from "@ngrx/component";
import { CustomersRootComponent } from "./customers-root.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [CustomersRootComponent],
  exports: [CustomersRootComponent],
  imports: [
    RouterModule,
    ReactiveComponentModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class CustomersRootComponentModule {}
```

Try it out by switching between the pages and selecting multipe customers.

## 3.3. Limit to customers selection

That's easy. Just add a new paramer to the reducers configuration:

_customers.reducer.ts_

```typescript
const { createUndoRedoReducer } = undoRedo({
  allowedActionTypes: [select.type, unselect.type], // <--
  undoActionType: undo.type,
  redoActionType: redo.type,
});
```

# 4. Optimistic Updates with nx's DataPersistence

In this exercise, we apply optimistic updates to the favourites feature in `holidays`. We want to mark a holiday as favourite even before the request is answered.

**1. Undo actions**

Add two new actions, we'll use to undo:

_holidays.actions.ts_

```typescript
export const addFavouriteUndo = createAction(
  "[Holidays] Add Favourite Undo",
  props<{ id: number }>()
);

export const removeFavouriteUndo = createAction(
  "[Holidays] Remove Favourite Undo",
  props<{ id: number }>()
);
```

---

**2. Update the state optimistically**

We update our state before the effect jumps in and sends a request the API. Further more, we also deal with the undo actions.

_holidays.reducer.ts_

```typescript
// replace with favouriteAdded
immerOn(addFavourite, removeFavouriteUndo, (state, { id }) => {
  if (state.favouriteIds.includes(id) === false) {
    state.favouriteIds.push(id);
  }
});

// replace with favouriteRemoved
immerOn(removeFavourite, addFavouriteUndo, (state, { id }) => {
  const ix = state.favouriteIds.indexOf(id);
  if (ix > -1) {
    state.favouriteIds.splice(ix, 1);
  }
});
```

---

**3. optimisticUpdate in the effect**

The last step is to apply `optimisticUpdate`, where we pass the http request and also define the fallback action if something goes wrong.

_customers.effects.ts_

```typescript
addFavourite$ = createEffect(() =>
  this.actions$.pipe(
    ofType(actions.addFavourite),
    optimisticUpdate({
      run: ({ id }) =>
        this.httpClient
          .post<void>(`${this.#baseUrl}/favourite/${id}`, {})
          .pipe(map(() => actions.favouriteAdded({ id }))),
      undoAction: ({ id }) => actions.addFavouriteUndo({ id }),
    })
  )
);

removeFavourite$ = createEffect(() =>
  this.actions$.pipe(
    ofType(actions.removeFavourite),
    optimisticUpdate({
      run: ({ id }) =>
        this.httpClient
          .delete<void>(`${this.#baseUrl}/favourite/${id}`, {})
          .pipe(map(() => actions.favouriteRemoved({ id }))),
      undoAction: ({ id }) => actions.removeFavouriteUndo({ id }),
    })
  )
);
```

---

**4. Verify**

Open the holidays, go offline and mark a holiday as your favourite.

You should see, that the icon changes immediately after the click but also switches back after the network failure.

Try the opposite with removing a favourite.
