export function safeAssign<T>(object: T, changes: Partial<T> = {}): void {
  Object.assign(object, changes);
}
