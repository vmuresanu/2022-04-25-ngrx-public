import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomersRootComponent } from './customers-root.component';

@NgModule({
  declarations: [CustomersRootComponent],
  exports: [CustomersRootComponent],
  imports: [RouterModule],
})
export class CustomersRootComponentModule {}
