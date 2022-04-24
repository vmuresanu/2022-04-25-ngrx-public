import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HolidaysComponent } from './holidays.component';
import { HolidayCardComponentModule } from '@eternal/holidays/ui';

@NgModule({
  declarations: [HolidaysComponent],
  exports: [HolidaysComponent],
  imports: [CommonModule, HolidayCardComponentModule],
})
export class HolidaysComponentModule {}
