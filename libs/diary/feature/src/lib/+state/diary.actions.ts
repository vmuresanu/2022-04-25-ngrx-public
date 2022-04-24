import { createAction, props } from '@ngrx/store';
import { DiaryResponse, DiaryWithEntries } from './diary.reducer';

export const load = createAction('[Diary] Load');
export const loadSuccess = createAction(
  '[Diary] Load Success',
  props<{ diaryResponse: DiaryResponse }>()
);

export const add = createAction(
  '[Diary] Add',
  props<{ title: string; description: string }>()
);
export const addSuccess = createAction(
  '[Diary] Add Success',
  props<{ diaryWithEntries: DiaryWithEntries }>()
);

export const addEntry = createAction(
  '[Diary] Add Entry',
  props<{ diaryId: number; content: string }>()
);
export const addEntrySuccess = createAction('[Diary] Add Entry Success');
