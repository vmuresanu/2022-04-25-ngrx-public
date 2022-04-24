import { syncLocalStorage } from './sync-local-storage';
import { Action } from '@ngrx/store';

export function isSyncLocalStorage(
  action: Action
): action is ReturnType<typeof syncLocalStorage> {
  return action.type === syncLocalStorage.type;
}
