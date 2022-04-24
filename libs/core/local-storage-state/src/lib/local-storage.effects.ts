import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { fromEvent, map, pluck } from 'rxjs';
import { filterDefined } from '@eternal/shared/ngrx-utils';
import { syncLocalStorage } from './sync-local-storage';

@Injectable()
export class LocalStorageEffects {
  storageEvent = createEffect(() =>
    fromEvent<StorageEvent>(window, 'storage').pipe(
      pluck('key'),
      filterDefined,
      map((featureState) => syncLocalStorage({ featureState }))
    )
  );
}
