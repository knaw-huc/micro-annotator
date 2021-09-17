import AnnotationSnippet from './AnnotationSnippet'
import {Annotation} from "../model/Annotation";

type AnnotationListProps = {
    myAnnotations: Annotation[];
    onSelectAnnotation: (annotationIdx: number) => void
}

export default function AnnotationList(props: AnnotationListProps) {
    return (
        <div>
            {props.myAnnotations.map((annotation, index) => (
                <AnnotationSnippet
                    key={index}
                    annot_id={index}
                    annotation={annotation}
                    onSelectAnnotation={props.onSelectAnnotation}/>
            ))}
        </div>
    )
}