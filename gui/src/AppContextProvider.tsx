import {useReducer} from 'react';
import {CreatorContext, creatorReducer, defaultCreatorContext} from './components/creator/CreatorContext';
import App from './App';
import {defaultErrorContext, ErrorContext, errorReducer} from './components/error/ErrorContext';

export default function AppContextProvider() {
  const [creatorState, setCreatorState] = useReducer(creatorReducer, defaultCreatorContext.creatorState);
  const [errorState, setErrorState] = useReducer(errorReducer, defaultErrorContext.errorState);

  return <>
    <CreatorContext.Provider value={{creatorState, setCreatorState}}>
      <ErrorContext.Provider value={{errorState, setErrorState}}>
        <App/>
      </ErrorContext.Provider>
    </CreatorContext.Provider>
  </>;
}
