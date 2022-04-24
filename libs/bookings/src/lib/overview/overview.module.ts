import { NgModule } from '@angular/core';
import { OverviewComponent } from './overview.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [OverviewComponent],
  exports: [OverviewComponent],
  imports: [MatTableModule, CommonModule],
})
export class OverviewComponentModule {}
