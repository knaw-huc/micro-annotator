import AnnotationSnippet from './AnnotationSnippet'
import {Annotation} from "../model/Annotation";

type AnnotationListProps = {
  select: (a: Annotation | undefined) => void;
  selected: Annotation | undefined;
  annotations: Annotation[];
}

export enum AnnotationListType {
  USER = 'user',
  RANGE = 'range'
}

export default function AnnotationList(props: AnnotationListProps) {
  return (
    <div>
      {props.annotations.map((annotation, index) => (
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
