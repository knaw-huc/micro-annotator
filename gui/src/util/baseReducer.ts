/**
 * Reducer creates new state from previous state and action
 * Replace when additional logic is needed to create appropriate state from action
 */
export function baseReducer<T>(state: T, action: T): T {
  return action;
}
