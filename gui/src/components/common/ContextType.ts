import AppContextProvider from '../../AppContextProvider';

/**
 * Implementations can be found in {@link AppContextProvider}
 */
export type ContextType<T> = {
  state: T;
  setState: (a: T) => void
}
