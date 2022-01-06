import {createContext, useContext} from 'react';
import {dummyProvider} from '../../util/dummyProvider';
import {ContextType} from '../common/ContextType';

/**
 * Searched annotation and related fields
 */
export const useSearchContext = () => useContext(SearchContext);
export type SearchStateType = {

  /**
   * Version ID, also used as elucidate collection ID
   */
  versionId: string,

  /**
   * Array of lines: text that can be annotated
   */
  annotatableText: string[],

  /**
   * Scan urls including image regions
   */
  imageRegions: string[],

  /**
   * Target ID of annotation linking to current text
   */
  targetId: string,

  /**
   * Line range of current text
   */
  beginRange: number,
  endRange: number,

};

export const defaultSearchContext = {
  state: {
    versionId: '',
    annotatableText: [],
    imageRegions: [],
    targetId: '',
    beginRange: 0,
    endRange: 0
  },
  setState: dummyProvider
} as ContextType<SearchStateType>;

export const SearchContext = createContext(defaultSearchContext);

/**
 * Copy fields from action to state that exist both in action and state
 */
export const searchReducer = (state: SearchStateType, action: SearchStateType): SearchStateType => {
  Object.keys(state).forEach((key: any) => {
    if ((action as any)[key]) {
      (state as any)[key] = (action as any)[key];
    }
  });
  return state;
}

