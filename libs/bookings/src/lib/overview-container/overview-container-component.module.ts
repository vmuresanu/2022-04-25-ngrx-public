import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { OverviewContainerComponent } from './overview-container.component';
import { OverviewComponentModule } from '../overview/overview.module';

@NgModule({
  declarations: [OverviewContainerComponent],
  exports: [OverviewContainerComponent],
  imports: [MatTableModule, CommonModule, OverviewComponentModule],
})
export class OverviewContainerComponentModule {}
