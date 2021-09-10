import {Annotation} from "../model/Annotation";

type AnnotationSnippetProps = {
  annot_id: number;
  annotation: Annotation;
  onSelectAnnotation: (id: number) => void
}

export default function AnnotationSnippet(props: AnnotationSnippetProps) {
  return (
    <div className={`annotation-snippet ${props.annotation.selected ? 'selection' : ''}`}
         onClick={() => props.onSelectAnnotation(props.annot_id)}>
      {props.annotation.entity_type}: {props.annotation.entity_text}
    </div>
  )
}
