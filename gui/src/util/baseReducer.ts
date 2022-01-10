/**
 * Create new state from previous state and action
 */
export function baseReducer<T>(state: T, action: T): T {
  return action;
}
