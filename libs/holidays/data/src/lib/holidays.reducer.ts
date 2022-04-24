import { Holiday } from '@eternal/holidays/model';
import { createFeature } from '@ngrx/store';
import {
  favouriteAdded,
  favouriteRemoved,
  load,
  loaded,
  redo,
  undo,
} from './holidays.actions';
import { LoadStatus } from '@eternal/shared/ngrx-utils';
import { immerOn } from 'ngrx-immer/store';
import { safeAssign } from '@eternal/shared/util';
import { initialUndoRedoState, undoRedo, UndoRedoState } from 'ngrx-wieder';

export interface HolidaysState extends UndoRedoState {
  holidays: Holiday[];
  favouriteIds: number[];
  loadStatus: LoadStatus;
}

const initialState: HolidaysState = {
  holidays: [],
  favouriteIds: [],
  loadStatus: 'not loaded',
  ...initialUndoRedoState,
};

const { createUndoRedoReducer } = undoRedo({
  undoActionType: undo.type,
  redoActionType: redo.type,
});

export const holidaysFeature = createFeature({
  name: 'holidays',
  reducer: createUndoRedoReducer<HolidaysState>(
    initialState,
    immerOn(load, (state) => {
      state.loadStatus = 'loading';
    }),
    immerOn(loaded, (state, { holidays }) => {
      safeAssign(state, { loadStatus: 'loaded', holidays });
    }),
    immerOn(favouriteAdded, (state, { id }) => {
      if (state.favouriteIds.includes(id) === false) {
        state.favouriteIds.push(id);
      }
    }),
    immerOn(favouriteRemoved, (state, { id }) => {
      const ix = state.favouriteIds.indexOf(id);
      if (ix > -1) {
        state.favouriteIds.splice(ix, 1);
      }
    })
  ),
});
