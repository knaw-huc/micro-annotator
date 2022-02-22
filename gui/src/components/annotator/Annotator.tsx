import AnnotationButtons from './AnnotationButtons';
import AnnotationList from '../list/AnnotationList';
import AnnotationTypeField from './AnnotationTypeField';
import {AnnotatorDocument} from './AnnotatorDocument';
import Elucidate from '../../resources/Elucidate';
import {MicroAnnotation} from '../../model/Annotation';
import { toDelElucidateAnn } from '../../util/convert/toDelElucidateAnn';
import {toMicroAnn} from '../../util/convert/toMicroAnn';
import {toNewElucidateAnn} from '../../util/convert/toNewElucidateAnn';
import {toUpdatableElucidateAnn} from '../../util/convert/toUpdatableElucidateAnn';
import {useCallback} from 'react';
import {useCreatorContext} from '../creator/CreatorContext';
import {useSearchContext} from '../search/SearchContext';

export default function Annotator() {

  const creator = useCreatorContext().state.creator;
  const searchState = useSearchContext().state;
  const setSearchState = useSearchContext().setState;

  const addAnnotation = useCallback(async (
    annotation: MicroAnnotation
  ) => {
    const toCreate = toNewElucidateAnn(annotation, creator, searchState);
    const created = await Elucidate.create(searchState.versionId, toCreate);
    const createdRecogitoAnn = toMicroAnn(created, searchState.beginRange, searchState.annotatableText);
    const userAnnotations = searchState.userAnnotations;
    userAnnotations.push(createdRecogitoAnn);
    setSearchState({...searchState, userAnnotations});
  }, [searchState, setSearchState, creator]);

  const updateAnnotation = useCallback(async (
    annotation: MicroAnnotation
  ) => {
    const userAnnotations = searchState.userAnnotations;
    const toUpdate = toUpdatableElucidateAnn(annotation, searchState.versionId, creator);
    const updated = await Elucidate.update(toUpdate);
    const converted = toMicroAnn(updated, searchState.beginRange, searchState.annotatableText);
    const i = userAnnotations.findIndex(a => a.id === converted.id);
    userAnnotations[i] = converted;
    setSearchState({...searchState, userAnnotations});
  }, [searchState, setSearchState, creator]);

  const deleteAnnotation = useCallback(async (
    annotation: MicroAnnotation
  ) => {
    const toDel = toDelElucidateAnn(annotation, searchState.versionId, creator);
    await Elucidate.delete(toDel);
    const converted = toMicroAnn(toDel, searchState.beginRange, searchState.annotatableText);
    const userAnnotations = searchState.userAnnotations;
    const i = userAnnotations.findIndex(a => a.id === converted.id);
    userAnnotations.splice(i, 1);
    setSearchState({...searchState, userAnnotations});
  }, [searchState, setSearchState, creator]);

  return <>
    <div className="annotator-column">
      <AnnotatorDocument
        onAddAnnotation={addAnnotation}
        onUpdateAnnotation={updateAnnotation}
        onDeleteAnnotation={deleteAnnotation}
      />
    </div>
    <div className="annotator-column">
      <AnnotationButtons/>
      <h4>Annotations</h4>
      <div>
        <AnnotationTypeField/>
      </div>
      <AnnotationList />
    </div>
  </>;
}
