# Professional NgRx - Lab 1

- [Professional NgRx - Lab 1](#professional-ngrx---lab-1)
  - [1. Customers data library](#1-customers-data-library)

In all the labs, we use the project names of the libraries. The libraries are located in **/libs** and can be nested.

For example, you find the library

- `booking` in **/libs/booking**,
- `customers-data` in **/libs/customers/data**, and
- `shared-ngrx-utils` in **/libs/shared/ngrx-utils**, etc.

## 1. Customers data library

Extract the customer's state into an own module called `customers-data`.

Run the linter afterwards, to verify that everything is alright.

<details>
<summary>Show Solution</summary>
<p>

**1. Create the library**

Generate a data library with

```bash
npx nx g lib data --directory customers
```

**2. Move files**

Move all NgRx files from `customers-feature` (directory +state) to the newly generated library `customers-data`. Use your IDE for that. It should automatically update the imports.

**3. Import NgRx modules in `customers-data`**

The newly created CustomerDataModule should be responsible to import the `[Store|Effects]Module` and setup the state. Move them from `CustomerFeatureModule` to `CustomerDataModule`.

_customers-data: customers-data.module.ts_

```typescript
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StoreModule } from "@ngrx/store";
import { customersFeature } from "./customers.reducer";
import { EffectsModule } from "@ngrx/effects";
import { CustomersEffects } from "./customers.effects";

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(customersFeature),
    EffectsModule.forFeature([CustomersEffects]),
  ],
})
export class CustomersDataModule {}
```

**4. Dependency `customers-feature` -> `customers-data`**

`customers-feature`: _customers-feature.module.ts_

```typescript
@NgModule({
  imports: [
    // existing imports
    CustomersDataModule, // <- add this
  ],
})
export class CustomersFeatureModule {}
```

**5. Verify app**

Run `npx nx serve` and verify that the app is still working.

**6. Run linter**

Run `npx nx affected:lint`. It should fail with a lots of **@nrwl/nx/enforce-module-boundaries** error messages. That is because, we didn't tag the data library.

**7. Dependency rules**

To tag the project, open _project.json_ in `customer-data`. Scroll down to the `tags` property and set the following value `["domain:customers", "type:data"]`.

**8. Deep imports**

The other error in the linting is because we have deep imports. To fix that, open the _index.ts_ of `customer-data`and add ONLY the classes and functions you want to expose.

```typescript
import {
  add,
  load,
  remove,
  select,
  unselect,
  update,
} from "./lib/customers.actions";

export { CustomersDataModule } from "./lib/customers-data.module";
export const customersActions = { load, add, update, remove, select, unselect };
export { fromCustomers } from "./lib/customers.selectors";
```

**9. Update container components**
We're almost done. Update the container components and the data guard in `customers-feature`

- _components/add-customer-component.ts_
- _components/customers-container.component.ts_
- _components/edit-customer.component.ts_
- _services/data-guard.ts_
- _../index.ts_

**10. Final check**

Finally, run `npx nx run-many --target lint --all` to verify the codebase doesn't break any rules.

</p>
</details>
