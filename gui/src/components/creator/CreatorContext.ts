import {createContext, useContext} from 'react';
import {baseReducer} from '../../util/baseReducer';
import Config from '../../Config';
import {ContextType} from '../common/ContextType';
import {dummyProvider} from '../../util/dummyProvider';

/**
 * Username for search and creating new annotations
 */
export const useCreatorContext = () => useContext(CreatorContext);
export type CreatorStateType = {
  creator: string;
}

export const defaultCreatorContext = {
  state: {
    creator: Config.CREATOR
  },
  setState: dummyProvider
} as ContextType<CreatorStateType>;

export const CreatorContext = createContext(defaultCreatorContext);
export const creatorReducer : (<T extends CreatorStateType>(s: T, a: T) => T) = baseReducer;

