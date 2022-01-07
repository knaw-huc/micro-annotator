import {
  AnnotationTypeContext,
  annotationTypeReducer,
  defaultAnnotationTypeContext
} from './components/annotator/AnnotationTypeContext';
import {CreatorContext, creatorReducer, defaultCreatorContext} from './components/creator/CreatorContext';
import {defaultErrorContext, ErrorContext, errorReducer} from './components/error/ErrorContext';
import {defaultSearchContext, SearchContext, searchReducer} from './components/search/SearchContext';
import App from './App';
import {useReducer} from 'react';

export default function AppContextProvider() {

  const [errorState, setErrorState] = useReducer(errorReducer, defaultErrorContext.state);
  const [creatorState, setCreatorState] = useReducer(creatorReducer, defaultCreatorContext.state);
  const [annotationTypeState, setAnnotationTypeState] = useReducer(annotationTypeReducer, defaultAnnotationTypeContext.state);
  const [searchState, setSearchState] = useReducer(searchReducer, defaultSearchContext.state);

  return <>
    <ErrorContext.Provider value={{state: errorState, setState: setErrorState}}>
      <CreatorContext.Provider value={{state: creatorState, setState: setCreatorState}}>
        <AnnotationTypeContext.Provider value={{state: annotationTypeState, setState: setAnnotationTypeState}}>
          <SearchContext.Provider value={{state: searchState, setState: setSearchState}}>
            <App/>
          </SearchContext.Provider>
        </AnnotationTypeContext.Provider>
      </CreatorContext.Provider>
    </ErrorContext.Provider>
  </>;
}
