import {useCallback, useEffect, useState} from 'react'

import Search from './components/Search'
import ImageColumn from './components/image/ImageColumn'
import AnnotatableText from './components/annotatable/AnnotatableText'
import Annotator from './components/annotator/Annotator'
import {AnnRange} from "./model/AnnRange";
import {Annotation} from "./model/Annotation";
import Elucidate from "./resources/Elucidate";
import {ElucidateTargetType, SelectorTarget} from "./model/ElucidateAnnotation";
import TextRepo from "./resources/TextRepo";
import Config from "./Config";
import {CreatorField} from "./components/CreatorField";
import {AnnotationListType} from "./components/annotator/AnnotationList";
import RecogitoDocument from "./components/poc/RecogitoDocument";

let text = `Inventaris ende specificatie van
432
alle den huysraet Imboel porceleijne
Liwaet potgelt gout en silverwerck
by Catharina Cleyburgh naergelaten
voor soo veel desselfs gesamentlycke
Erfgenamen competeren in gevolgen
van d Testamente van deselve Catharina
Cleyburgh
en nooteboome kas
Twaelf ses karsseboome stoelen
ses spaense stoelen`;

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
   * Coordinates of selected text
   */
  const [selectionRange, setSelectionRange] = useState<AnnRange>()

  /**
   * Annotations on display
   */
  const [rAnnotations, setRAnnotations] = useState<Annotation[]>([])

  /**
   * Annotations on display
   */
  const [annotations, setAnnotations] = useState<Annotation[]>([])

  /**
   * Expanded annotation on display
   */
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation>()

  /**
   * Type of annotations on display
   */
  const [annotationType, setAnnotationType] = useState<AnnotationListType>(AnnotationListType.USER)

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

  /**
   * Name used in creating new annotations or searching for existing user annotations
   */
  const [newAnnotation, setNewAnnotation] = useState<Annotation>()

  useEffect(() => {
    const getResourcesAsync = async () => {
      // if (!(targetId && currentCreator && beginRange && endRange)) {
      //   return;
      // }
      //
      // const found = annotationType === AnnotationListType.USER
      //   ? await Elucidate.getByCreator(currentCreator)
      //   : await Elucidate.getByRange(targetId, beginRange, endRange);
      // const converted = found
      //   .map(toAnnotation)
      //   .filter(a => !['line', 'textregion', 'column', 'scanpage'].includes(a.entity_type))
      //   .map(ann => setRelativeOffsets(ann, beginRange));
      // setAnnotations(converted);


      const getAnnotations = async () => {
        const res = await fetch("annotations.json", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        return await res.json();
      };

      // Load the annotations from the file
      getAnnotations().then((annotations: any) => {
        setRAnnotations(annotations
          .filter((a: any) => {
            const position = a.target.selector.find((s: any) => s.type === "TextPositionSelector");
            return position.start >= 0 && position.end <= text.length
          }));
      });


    }
    getResourcesAsync()
  }, [targetId, currentCreator, beginRange, endRange, annotationType]);

  useEffect(() => {
    if (annotationId) {
      searchAnnotation(annotationId);
    }
  }, [annotationId])

  const addAnnotation = useCallback(async (ann: Annotation) => {
    if (!versionId) {
      setError('Cannot save annotation when version id is not set')
      return;
    }
    ann = setAbsoluteOffsets(ann, beginRange);
    const created = await Elucidate.create(versionId, ann)
    setSelectionRange(undefined);
    setAnnotations([...annotations, setRelativeOffsets(created, beginRange)]);
  }, [versionId, beginRange]);

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
    const target: ElucidateTargetType[] = foundAnn.target;
    setRegionLinks(target
      .filter(t => !t.selector && t.type === 'Image')
      .map(t => t.source));

    // Get text by version uuid (first uuid in ann id):
    const foundVersionId = foundAnn.id.match(/.*\/w3c\/([0-9a-f-]{36})\/([0-9a-f-]{36})/)?.[1] as string;
    if (!foundVersionId) {
      setError(`No version ID found in ${foundAnn.id}`)
      return;
    }

    const selectorTarget = foundAnn.target.find(t => [undefined, 'Text'].includes(t.type)) as SelectorTarget;
    const grid: string[] = await TextRepo.getByVersionIdAndRange(
      foundVersionId, selectorTarget.selector.start, selectorTarget.selector.end
    );
    setTargetId(selectorTarget.source)
    setVersionId(foundVersionId)
    setBeginRange(selectorTarget.selector.start)
    setEndRange(selectorTarget.selector.end)
    setAnnotatableText(grid)
  }

  return (
    <div className="container">
      {versionId ? <RecogitoDocument
        text={text}
        annotations={rAnnotations}
        onAddAnnotation={(a) => addAnnotation(a)}
        creator={currentCreator}
      /> : null}

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
            <AnnotatableText
              text={annotatableText}
              onReadSelection={setSelectionRange}
              selected={selectedAnnotation}
            />
            <Annotator
              currentCreator={currentCreator}
              selectionRange={selectionRange}
              annotations={annotations}
              onAddAnnotation={addAnnotation}
              selected={selectedAnnotation}
              onSelect={setSelectedAnnotation}
              annotationType={annotationType}
              onSetAnnotationType={setAnnotationType}
            />
          </>
          : <>Click search to find an annotation by its ID</>}
      </div>
    </div>
  );
}

function setRelativeOffsets(a: Annotation, offset: number): Annotation {
  a.begin_anchor -= offset;
  a.end_anchor -= offset;
  return a;
}

function setAbsoluteOffsets(a: Annotation, offset: number) {
  a.begin_anchor += offset;
  a.end_anchor += offset;
  return a;
}

