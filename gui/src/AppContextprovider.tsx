import {useReducer} from 'react';
import {CreatorContext, creatorReducer, defaultCreatorContext} from './components/creator/CreatorContext';
import App from './App';

export default function AppContextprovider() {
  const [creatorState, setCreatorState] = useReducer(creatorReducer, defaultCreatorContext.creatorState);

  return <CreatorContext.Provider value={{creatorState: creatorState, setCreatorState: setCreatorState}}>
    <App/>
  </CreatorContext.Provider>;
}
