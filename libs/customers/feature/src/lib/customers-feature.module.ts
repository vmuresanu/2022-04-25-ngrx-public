import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CustomersEffects } from './+state/customers.effects';
import { customersFeature } from './+state/customers.reducer';
import {
  AddCustomerComponent,
  AddCustomerComponentModule,
} from './components/add-customer.component';
import {
  CustomersContainerComponent,
  CustomersContainerComponentModule,
} from './components/customers-container.component';
import {
  EditCustomerComponent,
  EditCustomerComponentModule,
} from './components/edit-customer.component';
import { DataGuard } from './services/data.guard';
import { CustomersRootComponentModule } from './components/customers-root/customers-root.component.module';
import { CustomersRootComponent } from './components/customers-root/customers-root.component';

@NgModule({
  imports: [
    CustomersRootComponentModule,
    CustomersContainerComponentModule,
    AddCustomerComponentModule,
    EditCustomerComponentModule,
    RouterModule.forChild([
      {
        path: '',
        canActivate: [DataGuard],
        component: CustomersRootComponent,
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
            path: ':id',
            component: EditCustomerComponent,
            data: { mode: 'edit' },
          },
        ],
      },
    ]),
    StoreModule.forFeature(customersFeature),
    EffectsModule.forFeature([CustomersEffects]),
  ],
})
export class CustomersFeatureModule {}
