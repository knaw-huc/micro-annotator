import SearchField from './SearchField';
import {useCallback, useEffect} from 'react';
import Elucidate from '../../resources/Elucidate';
import isString from '../../util/isString';
import {ElucidateTarget} from '../../model/ElucidateAnnotation';
import findImageRegions from '../../util/findImageRegions';
import toVersionId from '../../util/convert/toVersionId';
import findSelectorTarget from '../../util/findSelectorTarget';
import TextRepo from '../../resources/TextRepo';
import {useErrorContext} from '../error/ErrorContext';
import {useSearchContext} from './SearchContext';
import {usePrevious} from '../../util/usePrevious';
import {AnnotationListType} from '../list/AnnotationList';
import {toMicroAnn} from '../../util/convert/toMicroAnn';
import {isInRelativeRange} from '../../util/isInRelativeRange';
import {useAnnotationTypeContext} from '../annotator/AnnotationTypeContext';
import {useCreatorContext} from '../creator/CreatorContext';

export default function Search() {

  const setErrorState = useErrorContext().setState;
  const setSearchState = useSearchContext().setState;
  const annotationTypeState = useAnnotationTypeContext().state;
  const creatorState = useCreatorContext().state;
  const searchState = useSearchContext().state;
  const previousAnnotationId = usePrevious(searchState.annotationId);
  const previousAnnotationType = usePrevious(annotationTypeState.annotationType);

  const searchAnnotation = useCallback(async (annotationId: string) => {
    if (!annotationId) {
      return;
    }

    const foundAnn = await Elucidate.findByBodyId(annotationId);
    if (!foundAnn.target || isString(foundAnn.target)) {
      setErrorState({message: `Could not find targets in annotation: ${JSON.stringify(foundAnn)}`});
      return;
    }

    const target = foundAnn.target as ElucidateTarget[];
    const imageRegions = findImageRegions(target);
    const versionId = toVersionId(foundAnn.id);
    const selectorTarget = findSelectorTarget(foundAnn);
    const beginRange = selectorTarget.selector.start;
    const endRange = selectorTarget.selector.end;
    const targetId = selectorTarget.source;

    const annotatableText = await TextRepo.getByVersionIdAndRange(
      versionId,
      beginRange,
      endRange
    );

    const found = annotationTypeState.annotationType === AnnotationListType.USER
      ? await Elucidate.getByCreator(creatorState.creator)
      : await Elucidate.getByOverlap(searchState.targetId, searchState.beginRange, searchState.endRange);
    const annotations = found
      .map(a => toMicroAnn(a, searchState.beginRange, searchState.annotatableText))
      .filter(a => !['line', 'column'].includes(a.entity_type))
      .filter(ann => isInRelativeRange(ann.coordinates, searchState.endRange - searchState.beginRange));

    const searching = false;
    setSearchState({
      annotationId,
      versionId,
      annotatableText,
      imageRegions,
      targetId,
      beginRange,
      endRange,
      annotations,
      searching
    });
  }, [searchState, annotationTypeState, creatorState, setSearchState, setErrorState]);

  /**
   * Search on relevant context changes:
   */
  useEffect(() => {
    const idChanged = searchState.annotationId !== previousAnnotationId;
    const typeChanged = annotationTypeState.annotationType !== previousAnnotationType;
    if (idChanged || typeChanged) {
      searchAnnotation(searchState.annotationId)
        .catch(e => setErrorState({message: e.message}));
    }
  }, [
    searchState.annotationId, previousAnnotationId,
    annotationTypeState.annotationType, previousAnnotationType,
    setErrorState, searchAnnotation
  ]);

  return <SearchField
    onSearch={searchAnnotation}
  />
}

