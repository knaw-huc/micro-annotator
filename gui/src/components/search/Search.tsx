import {ElucidateAnnotation, ElucidateTarget} from '../../model/ElucidateAnnotation';
import {useCallback, useEffect} from 'react';
import Elucidate from '../../resources/Elucidate';
import findImageRegions from '../../util/findImageRegions';
import findSelectorTarget from '../../util/findSelectorTarget';
import {isInRelativeRange} from '../../util/isInRelativeRange';
import isString from '../../util/isString';
import {MicroAnnotation} from '../../model/Annotation';
import SearchField from './SearchField';
import TextRepo from '../../resources/TextRepo';
import {toMicroAnn} from '../../util/convert/toMicroAnn';
import toVersionId from '../../util/convert/toVersionId';
import {useAnnotationTypeContext} from '../annotator/AnnotationTypeContext';
import {useErrorContext} from '../error/ErrorContext';
import {usePrevious} from '../../util/usePrevious';
import {useSearchContext} from './SearchContext';
import {useSelectedAnnotationContext} from '../list/SelectedAnnotationContext';

export default function Search() {

  const annotationTypeState = useAnnotationTypeContext().state;
  const searchState = useSearchContext().state;
  const setErrorState = useErrorContext().setState;
  const setSearchState = useSearchContext().setState;
  const setSelectedAnnotation = useSelectedAnnotationContext().setState;

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

    const overlappingAnnotations = await getOverlapping(targetId, beginRange, endRange, annotatableText);
    const userAnnotations = await getByUser(targetId, beginRange, endRange, annotatableText);

    const searching = false;
    setSearchState({
      annotationId,
      versionId,
      annotatableText,
      imageRegions,
      targetId,
      beginRange,
      endRange,
      overlappingAnnotations,
      userAnnotations,
      searching
    });
  }, [setSearchState, setErrorState]);

  /**
   * Search when context
   */
  useEffect(() => {
    const idEqual = searchState.annotationId === previousAnnotationId;
    const typeEqual = annotationTypeState.annotationType === previousAnnotationType;
    if (idEqual && typeEqual) {
      return;
    }

    setSelectedAnnotation({selected: undefined});

    searchAnnotation(searchState.annotationId)
      .catch(e => setErrorState({message: e.message}));

  }, [
    searchState.searching,
    searchState.annotationId, previousAnnotationId,
    annotationTypeState.annotationType, previousAnnotationType,
    setErrorState, setSelectedAnnotation, searchAnnotation
  ]);

  return <SearchField
    onSearch={searchAnnotation}
  />;
}

async function getOverlapping(
  targetId: string,
  beginRange: number,
  endRange: number,
  annotatableText: string[]
): Promise<MicroAnnotation[]> {
  const annotations = await Elucidate.getByOverlap(targetId, beginRange, endRange);
  return mapAndFilter(annotations, annotatableText, beginRange, endRange);
}

async function getByUser(
  creator: string,
  beginRange: number,
  endRange: number,
  annotatableText: string[]
): Promise<MicroAnnotation[]> {
  const annotations = await Elucidate.getByCreator(creator);
  return mapAndFilter(annotations, annotatableText, beginRange, endRange);
}

function mapAndFilter(
  annotations: ElucidateAnnotation[],
  annotatableText: string[],
  beginRange: number,
  endRange: number
): MicroAnnotation[] {
  return annotations
    .map(a => toMicroAnn(a, beginRange, annotatableText))
    .filter(a => !['line', 'column'].includes(a.entity_type))
    .filter(ann => isInRelativeRange(ann.coordinates, endRange - beginRange));
}

