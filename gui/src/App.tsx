import {useCallback} from 'react';
import Annotator from './components/annotator/Annotator';
import {Creator} from './components/creator/Creator';
import Elucidate from './resources/Elucidate';
import ErrorMsg from './components/error/ErrorMsg';
import ImageColumn from './components/image/ImageColumn';
import {MicroAnnotation} from './model/Annotation';
import Search from './components/search/Search';
import {toMicroAnn} from './util/convert/toMicroAnn';
import {toNewElucidateAnn} from './util/convert/toNewElucidateAnn';
import {toUpdatableElucidateAnn} from './util/convert/toUpdatableElucidateAnn';
import {useCreatorContext} from './components/creator/CreatorContext';
import {useSearchContext} from './components/search/SearchContext';
import {useSelectedAnnotationContext} from './components/list/SelectedAnnotationContext';

export default function App() {

  const searchState = useSearchContext().state;
  const setSearchState = useSearchContext().setState;

  const setSelectedAnnotation = useSelectedAnnotationContext().setState;

  const creatorState = useCreatorContext().state;

  const addAnnotation = useCallback(async (a: MicroAnnotation) => {
    const toCreate = toNewElucidateAnn(a, creatorState.creator, searchState);
    const created = await Elucidate.create(searchState.versionId, toCreate);
    const createdRecogitoAnn = toMicroAnn(created, searchState.beginRange, searchState.annotatableText);
    const annotations = searchState.annotations;
    annotations.push(createdRecogitoAnn);
    setSearchState({...searchState, annotations});
  }, [searchState, setSearchState, creatorState]);

  const updateAnnotation = useCallback(async (a: MicroAnnotation) => {
    const toUpdate = toUpdatableElucidateAnn(a, searchState.versionId, creatorState.creator);
    const updated = await Elucidate.update(toUpdate);
    const converted = toMicroAnn(updated, searchState.beginRange, searchState.annotatableText);
    let annotations = searchState.annotations;
    const i = annotations.findIndex(a => a.id === converted.id);
    annotations[i] = converted;
    setSearchState({...searchState, annotations});
  }, [searchState, setSearchState, creatorState]);

  // TODO: remove:
  const updateAnnotationId = (annotationId: string) => {
    setSelectedAnnotation({selected: undefined});
    const searching = true;
    setSearchState({
      annotationId,
      searching
    })
  };

  return <div className="container">
    <ErrorMsg/>
    <Creator/>
    <Search/>
    <div className="row">
      <ImageColumn
        images={searchState.imageRegions}
      />
      <Annotator
        text={searchState.annotatableText.join('\n')}
        annotations={searchState.annotations}
        onAddAnnotation={addAnnotation}
        onUpdateAnnotation={updateAnnotation}
        onSearch={updateAnnotationId}
      />
    </div>
  </div>;
}

