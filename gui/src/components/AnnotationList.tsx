import AnnotationSnippet from './AnnotationSnippet'
import {Annotation} from "../model/Annotation";

type AnnotationListProps = {
  select: (a: Annotation | undefined) => void;
  selected: Annotation | undefined;
  myAnnotations: Annotation[];
}

export default function AnnotationList(props: AnnotationListProps) {
  return (
    <div>
      {props.myAnnotations.map((annotation, index) => (
        <AnnotationSnippet
          key={index}
          annot_id={index}
          annotation={annotation}
          select={props.select}
          selected={props.selected}
        />
      ))}
    </div>
  )
}
