import { createReducer, on } from '@ngrx/store';
import { diaryActions } from './diary.actions';

export const diaryFeatureKey = 'diary';

export interface Diary {
  id: number;
  title: string;
  description: string;
}

export interface DiaryEntry {
  id: number;
  diaryId: number;
  date: Date;
  content: string;
}

export type DiaryWithEntries = Diary & { entries: DiaryEntry[] };

export interface DiaryResponse {
  diaries: DiaryWithEntries[];
}

export interface DiaryState {
  diaries: Diary[];
  diaryEntries: DiaryEntry[];
  loaded: boolean;
}

const initialState: DiaryState = {
  diaries: [],
  diaryEntries: [],
  loaded: false,
};

export const diaryReducer = createReducer<DiaryState>(
  initialState,
  on(diaryActions.loadSuccess, (state, { diaryResponse }) => {
    const diaryEntries: DiaryEntry[][] = [];
    const diaries: Diary[] = [];

    for (const { entries, ...diary } of diaryResponse.diaries) {
      diaryEntries.push(entries);
      diaries.push(diary);
    }
    return {
      ...state,
      loaded: true,
      diaries: diaries,
      diaryEntries: diaryEntries.flat(),
    };
  }),
  on(diaryActions.addSuccess, (state, action) => {
    const { entries, ...diary } = action.diaryWithEntries;
    return {
      ...state,
      diaries: [...state.diaries, diary],
      diaryEntries: [...state.diaryEntries, ...entries],
    };
  })
);
