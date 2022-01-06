import {useReducer} from 'react';
import {CreatorContext, creatorReducer, defaultCreatorContext} from './components/creator/CreatorContext';
import App from './App';
import {defaultErrorContext, ErrorContext, errorReducer} from './components/error/ErrorContext';

export default function AppContextProvider() {
  const [creatorState, setCreatorState] = useReducer(creatorReducer, defaultCreatorContext.state);
  const [errorState, setErrorState] = useReducer(errorReducer, defaultErrorContext.state);

  return <>
    <CreatorContext.Provider value={{state: creatorState, setState: setCreatorState}}>
      <ErrorContext.Provider value={{state: errorState, setState: setErrorState}}>
        <App/>
      </ErrorContext.Provider>
    </CreatorContext.Provider>
  </>;
}
