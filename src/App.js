import {useEffect, useState} from 'react'

import Search from './components/Search'
import ImageParts from './components/ImageParts'
import AnnotatableText from './components/AnnotatableText'
import Annotator from './components/Annotator'
import Annotations from "./resources/Annotations";
import Texts from "./resources/Texts";

const OWNER = 'hennie';

export default function App() {

    const [regionLinks, setRegionLinks] = useState([])
    const [annotatableText, setAnnotatableText] = useState([])
    const [selectionRange, setSelectionRange] = useState([])
    const [myAnnotations, setMyAnnotations] = useState([])

    useEffect(() => {
        const getUserAnnotations = async () => {
            const annotationsFromServer = await Annotations.getBy(OWNER);
            setMyAnnotations(annotationsFromServer)
        }
        getUserAnnotations()
    }, []);

    const searchAnnotation = async (annotationID) => {
        const data = await Annotations.get(annotationID.id);
        const ann = data['annotations'];
        await setRegionLinks(ann['region_links'])
        const text = await Texts.get(ann.resource_id, ann.begin_anchor, ann.end_anchor);
        const grid = text['textgrid'];
        await setAnnotatableText(grid['_ordered_segments'])
    }

    const readSelection = () => {
        const s = window.getSelection();
        const range = {}
        range['beginAnchor'] = parseInt(s.anchorNode.parentNode.id);
        range['beginOffset'] = s.anchorOffset;
        range['endAnchor'] = parseInt(s.focusNode.parentNode.id);
        range['endOffset'] = s.focusOffset;
        setSelectionRange(range);
    }

    const getSelectionRange = () => {
        return selectionRange;
    }

    const onAddAnnotation = async (ann) => {
        ann['owner'] = OWNER;
        ann['begin_anchor'] += 56378;
        ann['end_anchor'] += 56378;
        await Annotations.create(ann);
        setMyAnnotations([...myAnnotations, ann]);
    }

    const setSelectedAnnotation = (selected_ann_id) => {
        setMyAnnotations(myAnnotations.map((annot, index) => {
            return {...annot, selected: index === selected_ann_id};
        }))
    }

    return (
        <div className="container">
            <Search onSearch={searchAnnotation}/>
            <div className='row'>
                <ImageParts images={regionLinks}/>
                <AnnotatableText text={annotatableText} onReadSelection={readSelection}/>
                <Annotator
                    selectionRange={getSelectionRange}
                    onReadSelection={readSelection}
                    onAddAnnotation={onAddAnnotation}
                    onSelectAnnotation={setSelectedAnnotation}
                    myAnnotations={myAnnotations}
                />
            </div>
        </div>
    );
}
