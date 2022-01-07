import AnnotationList from '../list/AnnotationList';
import {AnnotatorDocument} from './AnnotatorDocument';
import AnnotationTypeField from './AnnotationTypeField';
import {useSearchContext} from '../search/SearchContext';
import {useSelectedAnnotationContext} from '../list/SelectedAnnotationContext';
import {useCallback} from 'react';
import {MicroAnnotation} from '../../model/Annotation';
import {toNewElucidateAnn} from '../../util/convert/toNewElucidateAnn';
import Elucidate from '../../resources/Elucidate';
import {toMicroAnn} from '../../util/convert/toMicroAnn';
import {toUpdatableElucidateAnn} from '../../util/convert/toUpdatableElucidateAnn';
import {useCreatorContext} from '../creator/CreatorContext';

export default function Annotator() {

  const creator = useCreatorContext().state.creator;
  const searchState = useSearchContext().state;
  const setSearchState = useSearchContext().setState;
  const setSelectedAnnotation = useSelectedAnnotationContext().setState;

  const updateAnnotationId = (annotationId: string) => {
    const searching = true;
    setSearchState({searching, annotationId})
    const selected = undefined;
    setSelectedAnnotation({selected});
  };

  const addAnnotation = useCallback(async (a: MicroAnnotation) => {
    const toCreate = toNewElucidateAnn(a, creator, searchState);
    const created = await Elucidate.create(searchState.versionId, toCreate);
    const createdRecogitoAnn = toMicroAnn(created, searchState.beginRange, searchState.annotatableText);
    const annotations = searchState.annotations;
    annotations.push(createdRecogitoAnn);
    setSearchState({...searchState, annotations});
  }, [searchState, setSearchState, creator]);

  const updateAnnotation = useCallback(async (a: MicroAnnotation) => {
    const toUpdate = toUpdatableElucidateAnn(a, searchState.versionId, creator);
    const updated = await Elucidate.update(toUpdate);
    const converted = toMicroAnn(updated, searchState.beginRange, searchState.annotatableText);
    let annotations = searchState.annotations;
    const i = annotations.findIndex(a => a.id === converted.id);
    annotations[i] = converted;
    setSearchState({...searchState, annotations});
  }, [searchState, setSearchState, creator]);

  return <>
    <div className="annotator-column">
      <AnnotatorDocument
        onAddAnnotation={addAnnotation}
        onUpdateAnnotation={updateAnnotation}
      />
    </div>
    <div className="annotator-column">
      <h4>Annotations</h4>
      <div>
        <AnnotationTypeField/>
      </div>
      <AnnotationList
        onSelect={updateAnnotationId}
      />
    </div>
  </>;
}
