import {ElucidateTargetType, SelectorTarget} from './model/ElucidateAnnotation';
import {useCallback, useEffect, useState} from 'react';
import {AnnotationListType} from './components/annotator/AnnotationList';
import Config from './Config';
import {Creator} from './components/Creator';
import Elucidate from './resources/Elucidate';
import ErrorMsg from './components/common/ErrorMsg';
import ImageColumn from './components/image/ImageColumn';
import {isInRelativeRange} from './util/isInRelativeRange';
import isString from './util/isString';
import {MicroAnnotation} from './model/Annotation';
import RecogitoAnnotator from './components/recogito/RecogitoAnnotator';
import Search from './components/Search';
import TextRepo from './resources/TextRepo';
import {toMicroAnn} from './util/convert/toMicroAnn';
import {toNewElucidateAnn} from './util/convert/toNewElucidateAnn';
import {toUpdatableElucidateAnn} from './util/convert/toUpdatableElucidateAnn';
import toVersionId from './util/convert/toVersionId';

export default function App() {

  /**
   * Error message
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
   * Selected annotation in annotation list
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

  /**
   * Name used in creating new annotations or searching for existing user annotations
   */
  const [currentCreator, setCurrentCreator] = useState<string>(Config.CREATOR);

  useEffect(() => {
    const getAnnotationLists = async () => {
      if (!(beginRange && targetId && currentCreator && beginRange && endRange && annotatableText.length)) {
        return;
      }
      const found = annotationType === AnnotationListType.USER
        ? await Elucidate.getByCreator(currentCreator)
        : await Elucidate.getByOverlap(targetId, beginRange, endRange);
      const converted = found
        .map(a => toMicroAnn(a, beginRange, annotatableText))
        .filter(a => !['line', 'column'].includes(a.entity_type))
        .filter(ann => isInRelativeRange(ann.coordinates, endRange - beginRange));
      setAnnotations(converted);
    };
    getAnnotationLists()
      .catch(e => setError(e.message));
  }, [targetId, currentCreator, beginRange, endRange, annotationType, annotatableText]);

  useEffect(() => {
    if (annotationId) {
      searchAnnotation(annotationId)
        .catch(e => setError(e.message));
    }
  }, [annotationId]);

  const addAnnotation = useCallback(async (a: MicroAnnotation) => {
    const toCreate = toNewElucidateAnn(a, currentCreator, annotatableText, beginRange, versionId);
    const created = await Elucidate.create(versionId, toCreate);
    setAnnotations(annotations => {
      const createdRecogitoAnn = toMicroAnn(created, beginRange, annotatableText);
      return [createdRecogitoAnn, ...annotations];
    });
  }, [setAnnotations, annotatableText, beginRange, currentCreator, versionId]);

  const updateAnnotation = useCallback(async (a: MicroAnnotation) => {
    const toUpdate = toUpdatableElucidateAnn(a, versionId, currentCreator);
    const updated = await Elucidate.update(toUpdate);
    const updatedRecogitoAnn = toMicroAnn(updated, beginRange, annotatableText);
    setAnnotations(annotations => {
      const i = annotations.findIndex(a => a.id === updatedRecogitoAnn.id);
      annotations[i] = updatedRecogitoAnn;
      return [...annotations];
    });
  }, [annotatableText, beginRange, currentCreator, versionId]);

  const searchAnnotation = async (bodyId: string) => {
    if (!bodyId) {
      return;
    }
    let foundAnn = await Elucidate.findByBodyId(bodyId);
    if (isString(foundAnn.target)) {
      throw Error(`Could not find targets in annotation: ${JSON.stringify(foundAnn)}`);
    }
    const target = foundAnn.target as ElucidateTargetType[];

    let foundImageRegions = target
      .filter(t => !t.selector && t.type === 'Image')
      .map(t => t.source);

    const foundVersionId = toVersionId(foundAnn.id);

    const selectorTarget = (foundAnn.target as SelectorTarget[])
      .find((t: SelectorTarget) => [undefined, 'Text'].includes(t.type)) as SelectorTarget;

    const foundText = await TextRepo.getByVersionIdAndRange(
      foundVersionId,
      selectorTarget.selector.start,
      selectorTarget.selector.end
    );

    setVersionId(foundVersionId);
    setAnnotatableText(foundText);
    setImageRegions(foundImageRegions);
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
      <Creator
        onChange={setCurrentCreator}
        creator={currentCreator}
      />
      <Search
        searchId={annotationId}
        onSearch={updateAnnotationId}
      />
      <div className='row'>
        <ImageColumn
          images={imageRegions}
        />
        {versionId && <RecogitoAnnotator
            text={annotatableText.join('\n')}
            annotations={annotations}
            onAddAnnotation={addAnnotation}
            onUpdateAnnotation={updateAnnotation}
            creator={currentCreator}
            selected={selectedAnnotation}
            onSelect={(a: MicroAnnotation | undefined) => setSelectedAnnotation(a)}
            onSearch={updateAnnotationId}
            annotationType={annotationType}
            onSetAnnotationType={setAnnotationType}
        />}
      </div>
    </div>
  );
}

