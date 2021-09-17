import {useEffect, useState} from 'react'

import Search from './components/Search'
import ImageParts from './components/ImageParts'
import AnnotatableText from './components/AnnotatableText'
import Annotator from './components/Annotator'
import Annotations from "./resources/Annotations";
import Texts from "./resources/Texts";
import {AnnRange} from "./model/AnnRange";
import {Annotation} from "./model/Annotation";
import Config from "./Config";
import ElucidateCollection from "./ElucidateCollection";
import Elucidate from "./resources/Elucidate";

export default function App() {

  const [regionLinks, setRegionLinks] = useState([])
  const [annotatableText, setAnnotatableText] = useState([])
  const [selectionRange, setSelectionRange] = useState<AnnRange>()
  const [myAnnotations, setMyAnnotations] = useState([] as any [])
  const [beginOffsetInResource, setBeginOffsetInResource] = useState(0)
  const [collection, setCollection] = useState<string>()

  useEffect(() => {
    const getResources = async () => {
      setMyAnnotations(await Annotations.getBy(Config.OWNER));
      setCollection(await Elucidate.createCollection());
    }
    getResources()
  }, []);

  const searchAnnotation = async (annotation: any) => {
    const data = await Annotations.get(annotation.id);
    const ann = data['annotations'];
    setRegionLinks(ann['region_links'])

    const text = await Texts.get(ann.resource_id, ann.begin_anchor, ann.end_anchor);
    const grid = text['textgrid'];
    setBeginOffsetInResource(grid['text_grid_spec']['begin_offset_in_resource'])
    setAnnotatableText(grid['_ordered_segments'])
  }

  const readSelection = (range: AnnRange) => {
    setSelectionRange(range);
  }

  const onAddAnnotation = async (ann: Annotation) => {
    ann.owner = Config.OWNER;
    ann.begin_anchor += beginOffsetInResource;
    ann.end_anchor += beginOffsetInResource;
    if(collection) {
      await Elucidate.createAnnotation(collection, ann);
    } else {
      console.error("Could not create annotation: no collection available")
    }
    setMyAnnotations([...myAnnotations, ann]);
  }

  const setSelectedAnnotation = (selected_ann: number) => {
    setMyAnnotations(myAnnotations.map((annot: any, index: number) => {
      return {...annot, selected: index === selected_ann};
    }));
  }

  return (
    <div className="container">
      <ElucidateCollection collection={collection} setCollection={setCollection}/>
      <Search onSearch={searchAnnotation}/>
      <div className='row'>
        <ImageParts images={regionLinks}/>
        <AnnotatableText text={annotatableText} onReadSelection={readSelection}/>
        <Annotator
          getSelectionRange={() => selectionRange}
          onAddAnnotation={onAddAnnotation}
          onSelectAnnotation={setSelectedAnnotation}
          myAnnotations={myAnnotations}
        />
      </div>
    </div>
  );
}
