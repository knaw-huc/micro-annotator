import {useCallback, useEffect, useState} from 'react'

import Search from './components/Search'
import ImageColumn from './components/image/ImageColumn'
import {Annotation, isInRange, toAbsoluteOffsets} from "./model/Annotation";
import Elucidate from "./resources/Elucidate";
import {ElucidateTargetType, SelectorTarget} from "./model/ElucidateAnnotation";
import TextRepo from "./resources/TextRepo";
import Config from "./Config";
import {CreatorField} from "./components/CreatorField";
import {AnnotationListType} from "./components/annotator/AnnotationList";
import RecogitoDocument, {toRecogitoAnn} from "./components/poc/RecogitoDocument";

export default function App() {

  /**
   * Error message
   */
  const [error, setError] = useState<string>()

  /**
   * Image regions
   */
  const [regionLinks, setRegionLinks] = useState([] as string[])

  /**
   * Array of lines: text that can be annotated
   */
  const [annotatableText, setAnnotatableText] = useState([] as string[])

  /**
   * Annotations on display
   */
  const [annotations, setAnnotations] = useState<Annotation[]>([])

  /**
   * Type of annotations on display
   */
  const [annotationType] = useState<AnnotationListType>(AnnotationListType.USER)

  /**
   * Id of annotation linking to current text
   */
  const [annotationId, setAnnotationId] = useState<string>()

  /**
   * Target ID of annotation linking to current text
   */
  const [targetId, setTargetId] = useState('')

  /**
   * Line range of current text
   */
  const [beginRange, setBeginRange] = useState(0)
  const [endRange, setEndRange] = useState(0)


  /**
   * Version ID, also used as elucidate collection ID
   */
  const [versionId, setVersionId] = useState<string>()

  /**
   * Name used in creating new annotations or searching for existing user annotations
   */
  const [currentCreator, setCurrentCreator] = useState<string>(Config.CREATOR)

  useEffect(() => {
    console.log('annotations?', annotations.length);
  }, [annotations]);

  useEffect(() => {
    const getAnnotationListsAsync = async () => {
      if(!beginRange) {
        return;
      }
      if (!(targetId && currentCreator && beginRange && endRange && annotatableText.length)) {
        return;
      }
      const found = annotationType === AnnotationListType.USER
        ? await Elucidate.getByCreator(currentCreator)
        : await Elucidate.getByRange(targetId, beginRange, endRange);
      const converted = found
        .map(a => toRecogitoAnn(a, annotatableText, beginRange));
      const filtered = converted
        .filter(a => !['line', 'textregion', 'column', 'scanpage'].includes(a.entity_type))
        .filter(ann => isInRange(ann, endRange - beginRange))
      setAnnotations(filtered);
    }
    getAnnotationListsAsync()
  }, [targetId, currentCreator, beginRange, endRange, annotationType, annotatableText]);

  const addAnnotation = useCallback(async (ann: Annotation) => {
    if (!versionId) {
      setError('Cannot save annotation when version id is not set')
      return;
    }
    ann = toAbsoluteOffsets(ann, beginRange);
    const created = await Elucidate.create(versionId, ann)
    const recogitoAnn = toRecogitoAnn(created, annotatableText, beginRange);
    annotations.push(recogitoAnn);
    setAnnotations((anns: Annotation[]) => {
      anns.push(recogitoAnn);
      return anns
    });
  }, [versionId, beginRange, annotations, annotatableText]);

  useEffect(() => {
    if (annotationId) {
      searchAnnotation(annotationId);
    }
  }, [annotationId])


  const searchAnnotation = async (bodyId: string) => {
    let foundAnn = await Elucidate.getByBodyId(bodyId);
    if (!foundAnn) {
      setError('No elucidate annotation found');
      return;
    }
    if (typeof foundAnn.target === 'string') {
      setError(`Could not find img and txt targets in annotation with body id: ${bodyId}`);
      return;
    }
    const target = foundAnn.target as ElucidateTargetType[];
    setRegionLinks(target
      .filter(t => !t.selector && t.type === 'Image')
      .map(t => t.source));

    // Get text by version uuid (first uuid in ann id):
    const foundVersionId = foundAnn.id.match(/.*\/w3c\/([0-9a-f-]{36})\/([0-9a-f-]{36})/)?.[1] as string;
    if (!foundVersionId) {
      setError(`No version ID found in ${foundAnn.id}`)
      return;
    }

    const selectorTarget = (foundAnn.target as SelectorTarget[])
      .find((t: SelectorTarget) => [undefined, 'Text'].includes(t.type)) as SelectorTarget;
    const grid: string[] = await TextRepo.getByVersionIdAndRange(
      foundVersionId, selectorTarget.selector.start, selectorTarget.selector.end
    );
    setTargetId(selectorTarget.source)
    setBeginRange(selectorTarget.selector.start)
    setEndRange(selectorTarget.selector.end)
    setAnnotatableText(grid)
    setVersionId(foundVersionId)
  }


  return (
    <div className="container">
      {error ? <p style={{color: "red"}}>ERROR: {error}</p> : null}
      <CreatorField
        onChange={(newCreator: string) => setCurrentCreator(newCreator)}
        creator={currentCreator}
      />
      <Search
        onSearch={setAnnotationId}
      />
      <div className='row'>
        <ImageColumn
          images={regionLinks}
        />

        {annotatableText.length
          ?
          <>
            {versionId ? <RecogitoDocument
              text={annotatableText.join("\n")}
              annotations={annotations}
              onAddAnnotation={(a) => addAnnotation(a)}
              creator={currentCreator}
            /> : null}
          </>
          : <>Click search to find an annotation by its ID</>}
      </div>
    </div>
  );
}

