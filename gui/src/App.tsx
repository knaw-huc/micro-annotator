import {useCallback, useEffect, useState} from 'react';
import {AnnotationListType} from './components/list/AnnotationList';
import Annotator from './components/annotator/Annotator';
import Config from './Config';
import {Creator} from './components/creator/Creator';
import Elucidate from './resources/Elucidate';
import {ElucidateTarget} from './model/ElucidateAnnotation';
import ErrorMsg from './components/common/ErrorMsg';
import findImageRegions from './util/findImageRegions';
import findSelectorTarget from './util/findSelectorTarget';
import ImageColumn from './components/image/ImageColumn';
import {isInRelativeRange} from './util/isInRelativeRange';
import isString from './util/isString';
import {MicroAnnotation} from './model/Annotation';
import Search from './components/Search';
import TextRepo from './resources/TextRepo';
import {toMicroAnn} from './util/convert/toMicroAnn';
import {toNewElucidateAnn} from './util/convert/toNewElucidateAnn';
import {toUpdatableElucidateAnn} from './util/convert/toUpdatableElucidateAnn';
import toVersionId from './util/convert/toVersionId';
import {useCreatorContext} from './components/creator/CreatorContext';

export default function App() {

  /**
   * Error message, or falsy when no error
   */
  const [error, setError] = useState<string>();

  /**
   * Scan urls including image regions
   */
  const [imageRegions, setImageRegions] = useState([] as string[]);

  /**
   * Array of lines: text that can be annotated
   */
  const [annotatableText, setAnnotatableText] = useState([] as string[]);

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

  /**
   * Target ID of annotation linking to current text
   */
  const [targetId, setTargetId] = useState('');

  /**
   * Line range of current text
   */
  const [beginRange, setBeginRange] = useState(0);
  const [endRange, setEndRange] = useState(0);

  /**
   * Version ID, also used as elucidate collection ID
   */
  const [versionId, setVersionId] = useState<string>('');

  const {creatorState} = useCreatorContext();

  useEffect(() => {
    const getAnnotations = async () => {
      if (!(beginRange && targetId && creatorState && beginRange && endRange && annotatableText.length)) {
        return;
      }
      const found = annotationType === AnnotationListType.USER
        ? await Elucidate.getByCreator(creatorState.creator)
        : await Elucidate.getByOverlap(targetId, beginRange, endRange);
      const converted = found
        .map(a => toMicroAnn(a, beginRange, annotatableText))
        .filter(a => !['line', 'column'].includes(a.entity_type))
        .filter(ann => isInRelativeRange(ann.coordinates, endRange - beginRange));
      setAnnotations(converted);
    };
    getAnnotations()
      .catch(e => setError(e.message));
  }, [targetId, creatorState, beginRange, endRange, annotationType, annotatableText]);

  useEffect(() => {
    if (!annotationId) {
      return;
    }
    searchAnnotation(annotationId)
      .catch(e => setError(e.message));
  }, [annotationId]);

  const addAnnotation = useCallback(async (a: MicroAnnotation) => {
    const toCreate = toNewElucidateAnn(a, creatorState.creator, annotatableText, beginRange, versionId);
    const created = await Elucidate.create(versionId, toCreate);
    const createdRecogitoAnn = toMicroAnn(created, beginRange, annotatableText);
    setAnnotations([createdRecogitoAnn, ...annotations]);
  }, [annotations, annotatableText, beginRange, creatorState, versionId]);

  const updateAnnotation = useCallback(async (a: MicroAnnotation) => {
    const toUpdate = toUpdatableElucidateAnn(a, versionId, creatorState.creator);
    const updated = await Elucidate.update(toUpdate);
    const converted = toMicroAnn(updated, beginRange, annotatableText);
    const i = annotations.findIndex(a => a.id === converted.id);
    annotations[i] = converted;
    setAnnotations([...annotations]);
  }, [annotations, annotatableText, beginRange, creatorState, versionId]);

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
    setVersionId(versionId);
    setAnnotatableText(annotatableText);
    setImageRegions(imageRegions);
    setTargetId(selectorTarget.source);
    setBeginRange(selectorTarget.selector.start);
    setEndRange(selectorTarget.selector.end);
  };

  const updateAnnotationId = (id: string) => {
    setAnnotations([]);
    setSelectedAnnotation(undefined);
    setAnnotationId(id);
  };

  return (

    <div className="container">
      {error && <ErrorMsg
          msg={error}
      />}
      <Creator />
      <Search
        searchId={annotationId}
        onSearch={updateAnnotationId}
      />
      <div className="row">
        <ImageColumn
          images={imageRegions}
        />
        <Annotator
          text={annotatableText.join('\n')}
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

