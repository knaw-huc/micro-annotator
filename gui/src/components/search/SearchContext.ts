import {createContext, useContext} from 'react';
import {dummyProvider} from '../../util/dummyProvider';
import {ContextType} from '../common/ContextType';

/**
 * Searched annotation and related fields
 */
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

  /**
   * Requesting annotation at elucidate
   */
  searching: boolean
};

export const defaultSearchContext = {
  state: {
    versionId: '',
    annotatableText: [],
    imageRegions: [],
    targetId: '',
    beginRange: 0,
    endRange: 0,
    searching: true
  },
  setState: dummyProvider
} as ContextType<SearchStateType>;

export const SearchContext = createContext(defaultSearchContext);
export const useSearchContext = () => useContext(SearchContext);

/**
 * Copy fields from action to state that exist both in state and action
   */
export const searchReducer = (state: SearchStateType, action: any): SearchStateType => {
  Object.keys(state).forEach(key => {
    if (action[key]) {
      (state as any)[key] = action[key];
    }
  });
  return state;
}

