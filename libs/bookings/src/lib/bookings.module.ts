import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BookingsEffects } from './+state/bookings-effects.service';
import { bookingsFeature } from './+state/bookings.reducer';
import { OverviewComponent } from './overview/overview.component';
import { OverviewComponentModule } from './overview/overview.component.module';

@NgModule({
  imports: [
    CommonModule,
    OverviewComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: OverviewComponent,
      },
    ]),
    StoreModule.forFeature(bookingsFeature),
    EffectsModule.forFeature([BookingsEffects]),
  ],
})
export class BookingsModule {}
