import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { customersFeature } from './customers.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CustomersEffects } from './customers.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(customersFeature),
    EffectsModule.forFeature([CustomersEffects]),
  ],
})
export class CustomersDataModule {}
