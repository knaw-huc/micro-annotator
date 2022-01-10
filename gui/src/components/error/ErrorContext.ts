import {createContext, useContext} from 'react';
import {baseReducer} from '../../util/baseReducer';
import {ContextType} from '../common/ContextType';
import {dummyProvider} from '../../util/dummyProvider';

/**
 * Error message, or falsy when no error
 */
export const useErrorContext = () => useContext(ErrorContext);

export type ErrorStateType = {
  message: string;
}

export const defaultErrorContext = {
  state: {
    message: ''
  },
  setState: dummyProvider
} as ContextType<ErrorStateType>;

export const ErrorContext = createContext(defaultErrorContext);
export const errorReducer : (<T extends ErrorStateType>(s: T, a: T) => T) = baseReducer;

