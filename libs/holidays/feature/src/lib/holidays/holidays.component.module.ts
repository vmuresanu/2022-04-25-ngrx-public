import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HolidaysComponent } from './holidays.component';
import { HolidayCardComponentModule } from '@eternal/holidays/ui';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveComponentModule } from '@ngrx/component';

@NgModule({
  declarations: [HolidaysComponent],
  exports: [HolidaysComponent],
  imports: [
    CommonModule,
    HolidayCardComponentModule,
    MatIconModule,
    MatButtonModule,
    ReactiveComponentModule,
  ],
})
export class HolidaysComponentModule {}
