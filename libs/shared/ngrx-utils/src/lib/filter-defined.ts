import { filter, Observable } from 'rxjs';
import { isDefined } from '@eternal/shared/util';

export function filterDefined<T>(
  source: Observable<T | undefined>
): Observable<T> {
  return source.pipe(filter(isDefined));
}
