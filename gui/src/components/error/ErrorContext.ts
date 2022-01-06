import {createContext, useContext} from 'react';
import {dummyProvider} from '../../util/dummyProvider';
import {baseReducer} from '../../util/baseReducer';

/**
 * Error message, or falsy when no error
 */
export type ErrorStateType = {
  message: string;
}

export type ErrorContextType = {
  errorState: ErrorStateType;
  setErrorState: (a: ErrorStateType) => void
}

export const defaultErrorContext = {
  errorState: {
    message: ''
  },
  setErrorState: dummyProvider
} as ErrorContextType;

export const ErrorContext = createContext<ErrorContextType>(defaultErrorContext);

export const useErrorContext = () => useContext(ErrorContext);

export const errorReducer : (<T extends ErrorStateType>(s: T, a: T) => T) = baseReducer

