//import { useState } from 'react'

export default function AnnotationSnippet({annot_id, annotation, onSelectAnnotation}) {
//	const [selected, setSelected] = useState(false);

    /*	const selectAnnotation = () => {
            setSelected(true);
            console.log('selectAnnotation called on:')
            console.log(annot_id);
        }
    */
    return (
        <div className={`annotation-snippet ${annotation.selected ? 'selection' : ''}`}
             onClick={() => onSelectAnnotation(annot_id)}>

            {annotation.entity_type}: {annotation.entity_text}
        </div>
    )
}
