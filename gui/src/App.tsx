import {useCallback, useEffect, useState} from 'react';
import {AnnotationListType} from './components/list/AnnotationList';
import Annotator from './components/annotator/Annotator';
import Config from './Config';
import {Creator} from './components/creator/Creator';
import Elucidate from './resources/Elucidate';
import {ElucidateTarget} from './model/ElucidateAnnotation';
import ErrorMsg from './components/error/ErrorMsg';
import findImageRegions from './util/findImageRegions';
import findSelectorTarget from './util/findSelectorTarget';
import ImageColumn from './components/image/ImageColumn';
import {isInRelativeRange} from './util/isInRelativeRange';
import isString from './util/isString';
import {MicroAnnotation} from './model/Annotation';
import Search from './components/search/Search';
import TextRepo from './resources/TextRepo';
import {toMicroAnn} from './util/convert/toMicroAnn';
import {toNewElucidateAnn} from './util/convert/toNewElucidateAnn';
import {toUpdatableElucidateAnn} from './util/convert/toUpdatableElucidateAnn';
import toVersionId from './util/convert/toVersionId';
import {useCreatorContext} from './components/creator/CreatorContext';
import {useErrorContext} from './components/error/ErrorContext';
import {useSearchContext} from './components/search/SearchContext';

export default function App() {

  const setErrorState = useErrorContext().setState;

  const searchState = useSearchContext().state;
  const setSearchState = useSearchContext().setState;

  /**
   * Annotations on display
   */
  const [annotations, setAnnotations] = useState<MicroAnnotation[]>([]);

  /**
   * Selected annotation in annotation list, or falsy when no annotation
   */
  const [selectedAnnotation, setSelectedAnnotation] = useState<MicroAnnotation>();

  /**
   * Type of annotations shown
   */
  const [annotationType, setAnnotationType] = useState(AnnotationListType.USER);

  /**
   * Body ID of annotation linking to current text
   */
  const [annotationId, setAnnotationId] = useState<string>(Config.PLACEHOLDER_SEARCH_ID);

  const creatorState = useCreatorContext().state;

  const [searching, setSearching] = useState<boolean>(true);

  useEffect(() => {
    const getAnnotations = async () => {
      if(searching) {
        return;
      }
      const found = annotationType === AnnotationListType.USER
        ? await Elucidate.getByCreator(creatorState.creator)
        : await Elucidate.getByOverlap(searchState.targetId, searchState.beginRange, searchState.endRange);
      const converted = found
        .map(a => toMicroAnn(a, searchState.beginRange, searchState.annotatableText))
        .filter(a => !['line', 'column'].includes(a.entity_type))
        .filter(ann => isInRelativeRange(ann.coordinates, searchState.endRange - searchState.beginRange));
      setAnnotations(converted);
    };
    getAnnotations()
      .catch(e => setErrorState({message: e.message}));
  }, [searchState, annotationType, creatorState, setErrorState, searching]);

  useEffect(() => {
    if (!annotationId) {
      return;
    }
    const searchAnnotation = async (bodyId: string) => {
      if (!bodyId) {
        return;
      }
      const foundAnn = await Elucidate.findByBodyId(bodyId);
      if (!foundAnn.target || isString(foundAnn.target)) {
        throw Error(`Could not find targets in annotation: ${JSON.stringify(foundAnn)}`);
      }
      const target = foundAnn.target as ElucidateTarget[];
      const imageRegions = findImageRegions(target);
      const versionId = toVersionId(foundAnn.id);
      const selectorTarget = findSelectorTarget(foundAnn);
      const annotatableText = await TextRepo.getByVersionIdAndRange(
        versionId,
        selectorTarget.selector.start,
        selectorTarget.selector.end
      );

      setSearchState({
        versionId,
        annotatableText,
        imageRegions,
        targetId: selectorTarget.source,
        beginRange: selectorTarget.selector.start,
        endRange: selectorTarget.selector.end,
        searching: false
      });
      setSearching(false);
    };
    searchAnnotation(annotationId)
      .catch(e => setErrorState({message: e.message}));
  }, [searching, annotationId, setErrorState, setSearchState]);

  const addAnnotation = useCallback(async (a: MicroAnnotation) => {
    const toCreate = toNewElucidateAnn(a, creatorState.creator, searchState.annotatableText, searchState.beginRange, searchState.versionId);
    const created = await Elucidate.create(searchState.versionId, toCreate);
    const createdRecogitoAnn = toMicroAnn(created, searchState.beginRange, searchState.annotatableText);
    setAnnotations([createdRecogitoAnn, ...annotations]);
  }, [annotations, searchState, creatorState]);

  const updateAnnotation = useCallback(async (a: MicroAnnotation) => {
    const toUpdate = toUpdatableElucidateAnn(a, searchState.versionId, creatorState.creator);
    const updated = await Elucidate.update(toUpdate);
    const converted = toMicroAnn(updated, searchState.beginRange, searchState.annotatableText);
    const i = annotations.findIndex(a => a.id === converted.id);
    annotations[i] = converted;
    setAnnotations([...annotations]);
  }, [annotations, searchState, creatorState]);

  const updateAnnotationId = (id: string) => {
    setAnnotations([]);
    setSelectedAnnotation(undefined);
    setAnnotationId(id);
    setSearching(true);
  };

  return (

    <div className="container">
      <ErrorMsg />
      <Creator />
      <Search
        searchId={annotationId}
        onSearch={updateAnnotationId}
      />
      <div className="row">
        <ImageColumn
          images={searchState.imageRegions}
        />
        <Annotator
          text={searchState.annotatableText.join('\n')}
          annotations={annotations}
          onAddAnnotation={addAnnotation}
          onUpdateAnnotation={updateAnnotation}
          selected={selectedAnnotation}
          onSelect={(a: MicroAnnotation | undefined) => setSelectedAnnotation(a)}
          onSearch={updateAnnotationId}
          annotationType={annotationType}
          onSetAnnotationType={setAnnotationType}
        />
      </div>
    </div>
  );
}

