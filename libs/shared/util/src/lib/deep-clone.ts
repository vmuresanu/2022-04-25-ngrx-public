import structuredClone from '@ungap/structured-clone';

export function deepClone<T>(object: T): T {
  return structuredClone(object);
}
