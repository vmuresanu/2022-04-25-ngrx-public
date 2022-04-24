import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as actions from '../+state/holidays.actions';
import { fromHolidays } from '../+state/holidays.selectors';
import { Holiday } from '@eternal/holidays/model';

@Component({
  selector: 'eternal-holidays',
  template: `<h2>Choose among our Holidays</h2>
    <div class="flex flex-wrap justify-evenly">
      <eternal-holiday-card
        *ngFor="let holiday of holidays$ | async; trackBy: byId"
        [holiday]="holiday"
        (addFavourite)="addFavourite($event)"
        (removeFavourite)="removeFavourite($event)"
      >
      </eternal-holiday-card>
    </div> `,
})
export class HolidaysComponent implements OnInit {
  holidays$ = this.store.select(fromHolidays.selectHolidaysWithFavourite);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(actions.load());
  }

  addFavourite(id: number) {
    this.store.dispatch(actions.addFavourite({ id }));
  }

  removeFavourite(id: number) {
    this.store.dispatch(actions.removeFavourite({ id }));
  }

  byId(index: number, holiday: Holiday) {
    return holiday.id;
  }

}
