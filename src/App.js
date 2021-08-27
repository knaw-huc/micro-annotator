import { useState, useEffect } from 'react'

import Search from './components/Search'
import ImageParts from './components/ImageParts'
import AnnotatableText from './components/AnnotatableText'
import Annotator from './components/Annotator'

function App() {
	const annID = 'meeting-1728-06-19-session-1-resolution-17';
	const attendantslistAnnID = 'meeting-1728-01-08-session-1-attendantslist-1';
	
	const [regionLinks, setRegionLinks] = useState([])
	const [annotatableText, setAnnotatableText] = useState([])
	const [selectionRange, setSelectionRange] = useState([])
	const [myAnnotations, setMyAnnotations] = useState([])
	const [overlappingAnnotations, setOverlappingAnnotations] = useState([])
	
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
		const annotations = data['annotations']

		return annotations
	}
	
	// Search annotation
	const searchAnnotation = async (annotationID) => {
		const data = await fetchAnnotation(annotationID.id);
		const annotation = data['annotations'];
		
		// console.log(annotation);
		
		await setRegionLinks(annotation['region_links'])
		
		const textdata = await fetchText(annotation.resource_id, annotation.begin_anchor, annotation.end_anchor);
		const textgrid = textdata['textgrid'];

		await setAnnotatableText(textgrid['_ordered_segments'])
		
		const overlapData = await fetchOverlappingAnnotations(annotationID.id);
	}
					
	const fetchAnnotation = async (annotationID) => {
		const res = await fetch(`http://localhost:5001/annotations/${annotationID}`, {
			method: 'GET',
			headers: {
				'Content-type': 'application/json'
			}			
		})
		const data = await res.json()		
		return data;
	}
	
	const fetchText = async (resourceID, beginAnchor, endAnchor) => {
		const res = await fetch(`http://localhost:5000/${resourceID}/segmentedtext/textgrid/${beginAnchor},${endAnchor}`, {
			method: 'GET',
			headers: {
				'Content-type': 'application/json'
			}			
		})
		const data = await res.json()		
		return data;
	}
	
	const fetchOverlappingAnnotations = async (annotationID) => {
		console.log("haal nu overlapping annotations op");
		return [];
	}
	
	const readSelection =  () => {
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
	
	const onAddAnnotation = async ( newAnnotation ) => {
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
		
		const data = await res.json()		
		setMyAnnotations([...myAnnotations, newAnnotation])
	}	
	
	const setSelectedAnnotation =  ( selected_ann_id ) => {			
		setMyAnnotations(myAnnotations.map((annot, index) => index === selected_ann_id
		? {...annot, selected: true } : {...annot, selected: false}))
		
		console.log("hier moet ik de tekstselectie aanpassen")
	}
		
  	return (
    	<div className="container">
			<Search onSearch={searchAnnotation} />
			<div className='row'>
				<ImageParts images={regionLinks}/>
				<AnnotatableText text={annotatableText} onReadSelection={readSelection} />
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

export default App;
