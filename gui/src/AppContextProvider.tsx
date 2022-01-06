import {useReducer} from 'react';
import {CreatorContext, creatorReducer, defaultCreatorContext} from './components/creator/CreatorContext';
import App from './App';
import {defaultErrorContext, ErrorContext, errorReducer} from './components/error/ErrorContext';
import {defaultSearchContext, SearchContext, searchReducer} from './components/search/SearchContext';

export default function AppContextProvider() {
  const [errorState, setErrorState] = useReducer(errorReducer, defaultErrorContext.state);
  const [creatorState, setCreatorState] = useReducer(creatorReducer, defaultCreatorContext.state);
  const [searchState, setSearchState] = useReducer(searchReducer, defaultSearchContext.state);

  return <>
    <ErrorContext.Provider value={{state: errorState, setState: setErrorState}}>
      <CreatorContext.Provider value={{state: creatorState, setState: setCreatorState}}>
        <SearchContext.Provider value={{state: searchState, setState: setSearchState}}>
        <App/>
        </SearchContext.Provider>
      </CreatorContext.Provider>
    </ErrorContext.Provider>
  </>;
}
