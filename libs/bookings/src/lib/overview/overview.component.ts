import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { load } from '../+state/bookings.actions';
import { Booking } from '../+state/bookings.reducer';
import { BookingsRepository } from '../+state/bookings-repository.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'eternal-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  userName = '';
  displayedColumns = ['holidayId', 'date', 'status', 'comment'];
  dataSource = new MatTableDataSource<Booking>([]);

  constructor(
    private store: Store,
    private bookingsRepository: BookingsRepository
  ) {}

  ngOnInit(): void {
    this.bookingsRepository.bookingData$.subscribe((bookingData) => {
      if (bookingData?.loaded === false) {
        this.store.dispatch(load());
      } else {
        this.userName = bookingData.customerName;
        this.dataSource.data = bookingData.bookings;
      }
    });
  }
}
