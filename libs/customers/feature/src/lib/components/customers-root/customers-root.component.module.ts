import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { CustomersRootComponent } from './customers-root.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
