import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { load } from '../+state/customers.actions';

@Injectable({
  providedIn: 'root',
})
export class DataGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(): boolean {
    this.store.dispatch(load({ page: 1 }));
    return true;
  }
}
