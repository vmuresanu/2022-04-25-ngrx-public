import { Component, Input } from '@angular/core';
import { Booking } from '../+state/bookings.reducer';
import { MatTableDataSource } from '@angular/material/table';

export interface ViewModel {
  bookings: Booking[];
  customerName: string;
}

@Component({
  selector: 'eternal-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent {
  @Input() viewModel: ViewModel | undefined;
  displayedColumns = ['holidayId', 'date', 'status', 'comment'];
  dataSource = new MatTableDataSource<Booking>([]);
}
