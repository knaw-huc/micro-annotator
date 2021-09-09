import {useEffect, useState} from 'react'

import Search from './components/Search'
import ImageParts from './components/ImageParts'
import AnnotatableText from './components/AnnotatableText'
import Annotator from './components/Annotator'

export default function App() {

    const [regionLinks, setRegionLinks] = useState([])
    const [annotatableText, setAnnotatableText] = useState([])
    const [selectionRange, setSelectionRange] = useState([])
    const [myAnnotations, setMyAnnotations] = useState([])

    useEffect(() => {
        const getUserAnnotations = async () => {
            const annotationsFromServer = await fetchAnnotations()
            setMyAnnotations(annotationsFromServer)
        }

        getUserAnnotations()
    }, [])

    const fetchAnnotations = async () => {
        const res = await fetch('http://localhost:5001/volume-1728/annotations/56378,56499?owner=hennie')
        const data = await res.json()
        return data['annotations']
    }

    const searchAnnotation = async (annotationID) => {
        const data = await fetchAnnotation(annotationID.id);
        const annotation = data['annotations'];

        await setRegionLinks(annotation['region_links'])

        const textdata = await fetchText(annotation.resource_id, annotation.begin_anchor, annotation.end_anchor);
        const textgrid = textdata['textgrid'];

        await setAnnotatableText(textgrid['_ordered_segments'])
    }

    const fetchAnnotation = async (annotationID) => {
        const res = await fetch(`http://localhost:5001/annotations/${annotationID}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        })
        return await res.json();
    }

    const fetchText = async (resourceID, beginAnchor, endAnchor) => {
        const res = await fetch(`http://localhost:5000/${resourceID}/segmentedtext/textgrid/${beginAnchor},${endAnchor}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        })
        return await res.json();
    }

    const readSelection = () => {
        const selection = window.getSelection();
        const newSelRange = {}
        newSelRange['beginAnchor'] = parseInt(selection.anchorNode.parentNode.id);
        newSelRange['beginOffset'] = selection.anchorOffset;
        newSelRange['endAnchor'] = parseInt(selection.focusNode.parentNode.id);
        newSelRange['endOffset'] = selection.focusOffset;

        setSelectionRange(newSelRange);
    }

    const getSelectionRange = () => {
        return selectionRange;
    }

    const onAddAnnotation = async (newAnnotation) => {
        newAnnotation['owner'] = 'hennie';
        newAnnotation['begin_anchor'] += 56378;
        newAnnotation['end_anchor'] += 56378;
        const res = await fetch('http://localhost:5001/annotations', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(newAnnotation)
        })

        await res.json()
        setMyAnnotations([...myAnnotations, newAnnotation])
    }

    const setSelectedAnnotation = (selected_ann_id) => {
        setMyAnnotations(myAnnotations.map((annot, index) => index === selected_ann_id
            ? {...annot, selected: true} : {...annot, selected: false}))
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
