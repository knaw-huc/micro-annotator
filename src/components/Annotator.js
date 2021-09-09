import AddAnnotation from './AddAnnotation'
import AnnotationList from './AnnotationList'
import AnnotationContent from './AnnotationContent'

export default function Annotator({selectionRange, onAddAnnotation, onSelectAnnotation, myAnnotations}) {
    return (
        <div style={{'minWidth': '150px'}}>
            <div>
                Annotator
            </div>
            <AddAnnotation selectionRange={selectionRange} onAdd={onAddAnnotation}/>
            <AnnotationList myAnnotations={myAnnotations} onSelectAnnotation={onSelectAnnotation}/>
            <AnnotationContent myAnnotations={myAnnotations}/>
        </div>
    )
}
