import {createContext, useContext} from 'react';
import {dummyProvider} from '../../util/dummyProvider';
import Config from '../../Config';
import {baseReducer} from '../../util/baseReducer';
import {ContextType} from '../common/ContextType';

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
export const creatorReducer : (<T extends CreatorStateType>(s: T, a: T) => T) = baseReducer

