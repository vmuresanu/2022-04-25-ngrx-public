import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { customersActions } from '@eternal/customers/data';

@Injectable({
  providedIn: 'root',
})
export class DataGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(): boolean {
    this.store.dispatch(customersActions.load({ page: 1 }));
    return true;
  }
}
