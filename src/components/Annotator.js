import { useState } from 'react'

import Button from './Button'
import AddAnnotation from './AddAnnotation'
import AnnotationList from './AnnotationList'
import AnnotationContent from './AnnotationContent'

const Annotator = ({ selectionRange, onReadSelection, onAddAnnotation, onSelectAnnotation, myAnnotations }) => {	
	const [selectedAnnotation, setSelectedAnnotation] = useState(null);

	return (
		<div style={{ 'minWidth': '150px' }} >
			<div>
				Annotator
			</div>
			<AddAnnotation selectionRange={selectionRange} onAdd={onAddAnnotation} />
			<AnnotationList myAnnotations={myAnnotations} onSelectAnnotation={onSelectAnnotation} />
			<AnnotationContent myAnnotations={myAnnotations} />
		</div>
	)
}

export default Annotator