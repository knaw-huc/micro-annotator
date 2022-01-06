import {createContext, useContext} from 'react';
import {dummyProvider} from '../../util/dummyProvider';
import Config from '../../Config';
import {baseReducer} from '../../util/baseReducer';

/**
 * Searched annotation and related fields
 */
export const useSearchContext = () => useContext(SearchContext);

export type SearchStateType = {
  search: string;
}

export const defaultSearchContext = {
  searchState: {
    search: Config.CREATOR
  },
  setSearchState: dummyProvider
};

export const SearchContext = createContext(defaultSearchContext);

export const searchReducer : (<T extends SearchStateType>(s: T, a: T) => T) = baseReducer

