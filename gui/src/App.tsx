import {useEffect, useState} from 'react'

import Search from './components/Search'
import ImageParts from './components/ImageParts'
import AnnotatableText from './components/AnnotatableText'
import Annotator from './components/Annotator'
import {AnnRange} from "./model/AnnRange";
import {Annotation, toAnnotation} from "./model/Annotation";
import Elucidate from "./resources/Elucidate";
import {ElucidateTargetType, SelectorTarget} from "./model/ElucidateAnnotation";
import TextRepo from "./resources/TextRepo";
import Config from "./Config";

export default function App() {

  const [error, setError] = useState<string>()
  const [regionLinks, setRegionLinks] = useState([] as string[])
  const [annotatableText, setAnnotatableText] = useState([] as string[])
  const [selectionRange, setSelectionRange] = useState<AnnRange>()
  const [myAnnotations, setMyAnnotations] = useState<Annotation[]>([])
  const [beginOffsetInResource, setBeginOffsetInResource] = useState(0)
  const [versionId, setVersionId] = useState<string>()
  const [currentCreator, setCurrentCreator] = useState<string>(Config.CREATOR)
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation>()

  useEffect(() => {
    const getResourcesAsync = async () => {
      if (!(versionId && currentCreator && beginOffsetInResource)) {
        return;
      }
      const foundByCreatorAndVersion = (await Elucidate
        .getByCreator(currentCreator))
        .map(toAnnotation)
        .map(ann => setRelativeOffsets(ann, beginOffsetInResource));
      setMyAnnotations(foundByCreatorAndVersion);
    }
    getResourcesAsync()
  }, [versionId, currentCreator, beginOffsetInResource]);

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
      setError(`No version ID found in ${foundAnn.id}`);
      return;
    }

    const selectorTarget = foundAnn.target.find(t => t.type === undefined) as SelectorTarget;
    const grid: string[] = await TextRepo.getByVersionIdAndRange(
      foundVersionId, selectorTarget.selector.start, selectorTarget.selector.end
    );

    setVersionId(foundVersionId);
    setBeginOffsetInResource(selectorTarget.selector.start)
    setAnnotatableText(grid)
  }

  const onAddAnnotation = async (ann: Annotation) => {
    if (!versionId) {
      setError('Cannot save annotation when version id is not set')
      return;
    }
    ann = setAbsoluteOffsets(ann, beginOffsetInResource);

    const created = await Elucidate.create(versionId, ann)
    setSelectionRange(undefined);
    setMyAnnotations([...myAnnotations, setRelativeOffsets(created, beginOffsetInResource)]);
    setCurrentCreator(created.creator);
  }

  return (
    <div className="container">
      {error ? <p style={{color: "red"}}>ERROR: {error}</p> : null}
      <Search onSearch={searchAnnotation}/>
      <div className='row'>
        <ImageParts images={regionLinks}/>
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
              onAddAnnotation={onAddAnnotation}
              myAnnotations={myAnnotations}
              select={setSelectedAnnotation}
              selected={selectedAnnotation}
            />
          </>
          : <>Click search to find an annotation by its ID</>}
      </div>
    </div>
  );
}

// TODO: determine relative offsets only in text containing anno
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

