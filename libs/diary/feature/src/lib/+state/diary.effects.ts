import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import * as actions from './diary.actions';
import { DiaryResponse, DiaryWithEntries } from './diary.reducer';

@Injectable()
export class DiaryEffects {
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.load),
      switchMap(() => this.httpClient.get<DiaryResponse>('/diary')),
      map((diaryResponse) => actions.loadSuccess({ diaryResponse }))
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.add),
      switchMap(({ title, description }) =>
        this.httpClient.post<DiaryWithEntries>('/diary', {
          title,
          description,
        })
      ),
      map((diaryWithEntries) => actions.addSuccess({ diaryWithEntries }))
    )
  );

  addEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.addEntry),
      switchMap(({ diaryId, content }) =>
        this.httpClient.post('/diary', {
          diaryId,
          content,
        })
      ),
      map(() => actions.addEntrySuccess())
    )
  );

  constructor(private actions$: Actions, private httpClient: HttpClient) {}
}
