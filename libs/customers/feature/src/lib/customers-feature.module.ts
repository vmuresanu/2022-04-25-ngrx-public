import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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
import { CustomersDataModule } from '@eternal/customers/data';
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
    CustomersDataModule,
  ],
})
export class CustomersFeatureModule {}
