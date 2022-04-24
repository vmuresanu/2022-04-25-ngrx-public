import { Customer } from '@eternal/customers/model';
import { createFeature } from '@ngrx/store';
import {
  init,
  load,
  loadFailure,
  loadSuccess,
  redo,
  select,
  undo,
  unselect,
} from './customers.actions';
import { immerOn } from 'ngrx-immer/store';
import { safeAssign } from '@eternal/shared/util';
import { initialUndoRedoState, undoRedo, UndoRedoState } from 'ngrx-wieder';

export interface CustomersState extends UndoRedoState {
  customers: Customer[];
  page: number;
  total: number;
  selectedId: number | undefined;
  isLoaded: boolean;
  hasError: boolean;
}

export const initialState: CustomersState = {
  customers: [],
  page: 0,
  total: 0,
  selectedId: undefined,
  isLoaded: false,
  hasError: false,
  ...initialUndoRedoState,
};

const { createUndoRedoReducer } = undoRedo({
  allowedActionTypes: [select.type, unselect.type],
  undoActionType: undo.type,
  redoActionType: redo.type,
});

export const customersFeature = createFeature({
  name: 'customers',
  reducer: createUndoRedoReducer<CustomersState>(
    initialState,
    immerOn(init, (state) => {
      if (state.hasError) {
        // This will not work: state = initialState;
        safeAssign(state, initialState);
      }
    }),
    immerOn(load, (state, { page }) => {
      state.page = page;
    }),
    immerOn(loadSuccess, (state, { customers, total }) => {
      safeAssign(state, {
        customers,
        total,
        isLoaded: true,
        hasError: false,
      });
    }),
    immerOn(loadFailure, (state) => {
      state.hasError = true;
    }),
    immerOn(select, (state, { id }) => {
      state.selectedId = id;
    }),
    immerOn(unselect, (state) => {
      state.selectedId = undefined;
    })
  ),
});
