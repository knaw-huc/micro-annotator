import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import AppContextProvider from './AppContextProvider';
import Config from './Config';

export default function AppRouter() {
  return <BrowserRouter>
    <Routes>
      <Route path="/annotation/:annotationId" element={<AppContextProvider/>}/>
      <Route path="*" element={<Navigate to={`/annotation/${Config.PLACEHOLDER_SEARCH_ID}`}/>} />
    </Routes>
  </BrowserRouter>;
}
