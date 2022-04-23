import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AddCustomerComponent,
  AddCustomerComponentModule,
} from './components/add-customer.component';
import {
  CustomerRootComponent,
  CustomerRootComponentModule,
} from './components/customer-root.component';
import {
  CustomersContainerComponent,
  CustomersContainerComponentModule,
} from './components/customers-container.component';
import {
  EditCustomerComponent,
  EditCustomerComponentModule,
} from './components/edit-customer.component';
import { DataGuard } from './services/data.guard';
import { CustomersDataModule } from '@eternal/customers/data';

@NgModule({
  imports: [
    CustomerRootComponentModule,
    CustomersContainerComponentModule,
    AddCustomerComponentModule,
    EditCustomerComponentModule,
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
            path: ':id',
            component: EditCustomerComponent,
            data: { mode: 'edit' },
          },
        ],
      },
    ]),
    CustomersDataModule,
  ],
})
export class CustomersFeatureModule {}
