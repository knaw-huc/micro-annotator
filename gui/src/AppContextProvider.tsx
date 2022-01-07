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
import {
  defaultSelectedAnnotationContext,
  SelectedAnnotationContext,
  selectedAnnotationReducer
} from './components/list/SelectedAnnotationContext';

export default function AppContextProvider() {

  const [errorState, setErrorState] = useReducer(
    errorReducer,
    defaultErrorContext.state
  );
  const [creatorState, setCreatorState] = useReducer(
    creatorReducer,
    defaultCreatorContext.state
  );
  const [searchState, setSearchState] = useReducer(
    searchReducer,
    defaultSearchContext.state
  );
  const [annotationTypeState, setAnnotationTypeState] = useReducer(
    annotationTypeReducer,
    defaultAnnotationTypeContext.state
  );
  const [selectedAnnotationState, setSelectedAnnotation] = useReducer(
    selectedAnnotationReducer,
    defaultSelectedAnnotationContext.state
  );

  return <>
    <ErrorContext.Provider value={{state: errorState, setState: setErrorState}}>
      <CreatorContext.Provider value={{state: creatorState, setState: setCreatorState}}>
        <AnnotationTypeContext.Provider value={{state: annotationTypeState, setState: setAnnotationTypeState}}>
          <SelectedAnnotationContext.Provider value={{state: selectedAnnotationState, setState: setSelectedAnnotation}}>
            <SearchContext.Provider value={{state: searchState, setState: setSearchState}}>
              <App/>
            </SearchContext.Provider>
          </SelectedAnnotationContext.Provider>
        </AnnotationTypeContext.Provider>
      </CreatorContext.Provider>
    </ErrorContext.Provider>
  </>;
}
