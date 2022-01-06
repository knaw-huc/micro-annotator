import {createContext, useContext} from 'react';
import {dummyProvider} from '../../util/dummyProvider';
import Config from '../../Config';
import {baseReducer} from '../../util/baseReducer';

/**
 * User name when searching user annotations or creating new annotations
 */
export type CreatorStateType = {
  creator: string;
}

export type CreatorContextType = {
  creatorState: CreatorStateType;
  setCreatorState: (a: CreatorStateType) => void
}

export const defaultCreatorContext = {
  creatorState: {
    creator: Config.CREATOR
  },
  setCreatorState: dummyProvider
} as CreatorContextType;

export const CreatorContext = createContext<CreatorContextType>(defaultCreatorContext);

export const useCreatorContext = () => useContext(CreatorContext);

export const creatorReducer : (<T extends CreatorStateType>(s: T, a: T) => T) = baseReducer

