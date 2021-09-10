import {useEffect, useState} from 'react'

import Search from './components/Search'
import ImageParts from './components/ImageParts'
import AnnotatableText from './components/AnnotatableText'
import Annotator from './components/Annotator'
import Annotations from "./resources/Annotations";
import Texts from "./resources/Texts";
import {AnnRange} from "./model/AnnRange";

const OWNER = 'hennie';

export default function App() {

  const [regionLinks, setRegionLinks] = useState([])
  const [annotatableText, setAnnotatableText] = useState([])
  const [selectionRange, setSelectionRange] = useState<AnnRange>()
  const [myAnnotations, setMyAnnotations] = useState([] as any [])

  useEffect(() => {
    const getUserAnnotations = async () => {
      const annotationsFromServer = await Annotations.getBy(OWNER);
      setMyAnnotations(annotationsFromServer)
    }
    getUserAnnotations()
  }, []);

  const searchAnnotation = async (annotation: any) => {
    const data = await Annotations.get(annotation.id);
    const ann = data['annotations'];
    console.log('region_links', ann['region_links'])
    await setRegionLinks(ann['region_links'])
    const text = await Texts.get(ann.resource_id, ann.begin_anchor, ann.end_anchor);
    const grid = text['textgrid'];
    await setAnnotatableText(grid['_ordered_segments'])
  }

  const readSelection = (range: AnnRange) => {
    setSelectionRange(range);
  }

  const onAddAnnotation = async (ann: any) => {
    ann['owner'] = OWNER;
    ann['begin_anchor'] += 56378;
    ann['end_anchor'] += 56378;
    await Annotations.create(ann);
    setMyAnnotations([...myAnnotations, ann]);
  }

  const setSelectedAnnotation = (selected_ann: number) => {
    setMyAnnotations(myAnnotations.map((annot: any, index: number) => {
      return {...annot, selected: index === selected_ann};
    }));
  }

  return (
    <div className="container">
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
