import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { BlinkerDirectiveModule } from '@eternal/shared/ui';
import { HolidayCardComponent } from './holiday-card.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [HolidayCardComponent],
  exports: [HolidayCardComponent],
  imports: [
    MatCardModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    BlinkerDirectiveModule,
    MatIconModule,
  ],
})
export class HolidayCardComponentModule {}
