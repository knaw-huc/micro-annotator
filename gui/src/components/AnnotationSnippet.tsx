import {Annotation} from "../model/Annotation";
import {toRangeStr} from "../util/toRangeStr";
import {toRange} from "../model/AnnRange";

type AnnotationSnippetProps = {
  annot_id: number;
  annotation: Annotation;
  onSelectAnnotation: (id: number) => void
}

export default function AnnotationSnippet(props: AnnotationSnippetProps) {
  return (
    <div className={`annotation-snippet ${props.annotation.selected ? 'selection' : ''}`}
         onClick={() => props.onSelectAnnotation(props.annot_id)}>
      {toRangeStr(toRange(props.annotation))}
    </div>
  )
}
