export function filterDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
