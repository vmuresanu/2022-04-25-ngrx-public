import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from '@eternal/customers/model';
import { Configuration } from '@eternal/shared/config';
import { MessageService } from '@eternal/shared/ui-messaging';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, filter, map, tap } from 'rxjs/operators';
import {
  add,
  get,
  init,
  load,
  loadFailure,
  loadSuccess,
  remove,
  update,
} from './customers.actions';
import { customersFeature } from './customers.reducer';
import { safeSwitchMap } from '@eternal/shared/ngrx-utils';

@Injectable()
export class CustomersEffects {
  #baseUrl = '/customers';

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(init),
      concatLatestFrom(() =>
        this.store.select(customersFeature.selectIsLoaded)
      ),
      filter(([, isLoaded]) => isLoaded === false),
      map(() => get({ page: 1 }))
    )
  );

  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(get),
      concatLatestFrom(() => this.store.select(customersFeature.selectPage)),
      filter(([action, page]) => action.page !== page),
      map(([{ page }]) => load({ page }))
    )
  );

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(load),
      safeSwitchMap(
        ({ page }) =>
          this.http
            .get<{ content: Customer[]; total: number }>(this.#baseUrl, {
              params: new HttpParams().set('page', page),
            })
            .pipe(
              map(({ content, total }) =>
                loadSuccess({ customers: content, total, page })
              )
            ),
        () => loadFailure()
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(add),
      concatMap(({ customer }) =>
        this.http.post<{ customers: Customer[]; id: number }>(
          this.#baseUrl,
          customer
        )
      ),

      tap(() => this.router.navigateByUrl('/customers')),
      map(() => load({ page: 1 }))
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(update),
      concatMap(({ customer, forward, message, callback }) =>
        this.http.put<Customer[]>(this.#baseUrl, customer).pipe(
          tap(() => {
            if (callback !== undefined) {
              callback();
            }
          }),
          tap(() => this.uiMessage.info(message)),
          tap(() => this.router.navigateByUrl(forward))
        )
      ),
      map(() => load({ page: 1 }))
    )
  );

  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(remove),
      concatMap(({ customer }) =>
        this.http.delete<Customer[]>(`${this.#baseUrl}/${customer.id}`)
      ),
      tap(() => this.router.navigateByUrl('/customers')),
      map(() => load({ page: 1 }))
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private store: Store,
    private configuration: Configuration,
    private uiMessage: MessageService
  ) {}
}
