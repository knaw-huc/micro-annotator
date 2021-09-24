import {useEffect, useState} from 'react'

import Search from './components/Search'
import ImageParts from './components/ImageParts'
import AnnotatableText from './components/AnnotatableText'
import Annotator from './components/Annotator'
import Annotations from "./resources/Annotations";
import {AnnRange} from "./model/AnnRange";
import {Annotation} from "./model/Annotation";
import Config from "./Config";
import Elucidate from "./resources/Elucidate";
import {SelectorTarget} from "./model/ElucidateAnnotation";
import TextRepo from "./resources/TextRepo";

export default function App() {

  const [error, setError] = useState<string>()
  const [regionLinks, setRegionLinks] = useState([] as string[])
  const [annotatableText, setAnnotatableText] = useState([] as string[])
  const [selectionRange, setSelectionRange] = useState<AnnRange>()
  const [myAnnotations, setMyAnnotations] = useState([] as any [])
  const [beginOffsetInResource, setBeginOffsetInResource] = useState(0)

  useEffect(() => {
    const getResources = async () => {
      setMyAnnotations(await Annotations.getBy(Config.OWNER));
    }
    getResources()
  }, []);

  const searchAnnotation = async (annotation: any) => {
    let elAnn = await Elucidate.getByBodyId(annotation.id);
    if (!elAnn) {
      setError('No elucidate annotation found');
      return;
    }

    setRegionLinks(elAnn.target
      .filter(t => !t.selector && t.type === 'Image')
      .map(t => t.source));

    // TODO: where to find proper resourceId?
    let resourceTarget = elAnn.target.find(t => t.type === undefined) as SelectorTarget;
    let resourceId = resourceTarget?.source?.match(/.*(find\/)(.*)(\/contents)/)?.[2];
    if (!resourceId) {
      setError('No resource ID found in ' + JSON.stringify(resourceTarget));
      return;
    }

    // Get text by version uuid (first uuid in ann id):
    const versionId = elAnn.id.match(/.*\/w3c\/([0-9a-f-]{36})\/([0-9a-f-]{36})/)?.[1] as string;
    if (!versionId) {
      setError('No version ID found in ' + elAnn.id);
      return;
    }
    const grid: string[] = await TextRepo.getByVersionIdAndRange(
      versionId, resourceTarget.selector.start, resourceTarget.selector.end
    );

    setBeginOffsetInResource(resourceTarget.selector.start)
    setAnnotatableText(grid)
  }

  const readSelection = (range: AnnRange) => {
    setSelectionRange(range);
  }

  const onAddAnnotation = async (ann: Annotation) => {
    ann.owner = Config.OWNER;
    ann.begin_anchor += beginOffsetInResource;
    ann.end_anchor += beginOffsetInResource;
    setMyAnnotations([...myAnnotations, ann]);
  }

  const setSelectedAnnotation = (selected_ann: number) => {
    setMyAnnotations(myAnnotations.map((annot: any, index: number) => {
      return {...annot, selected: index === selected_ann};
    }));
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
            <AnnotatableText text={annotatableText} onReadSelection={readSelection}/>
            <Annotator
              getSelectionRange={() => selectionRange}
              onAddAnnotation={onAddAnnotation}
              onSelectAnnotation={setSelectedAnnotation}
              myAnnotations={myAnnotations}
            />
          </>
          : <>Click search to find an annotation by its ID</>}
      </div>
    </div>
  );
}
