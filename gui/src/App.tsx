import Annotator from './components/annotator/Annotator';
import {Creator} from './components/creator/Creator';
import ErrorMsg from './components/error/ErrorMsg';
import ImageColumn from './components/image/ImageColumn';
import Search from './components/search/Search';

export default function App() {

  return <div className="container">
    <ErrorMsg/>
    <Creator/>
    <Search/>
    <div className="row">
      <ImageColumn />
      <Annotator />
    </div>
  </div>;
}

