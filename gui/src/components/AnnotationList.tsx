import AnnotationSnippet from './AnnotationSnippet'
import {Annotation} from "../model/Annotation";

type AnnotationListProps = {
  annotations: Annotation[];
  selected: Annotation | undefined;
  onSelect: (a: Annotation | undefined) => void;
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
          selected={props.selected}
          onSelect={props.onSelect}
        />
      ))}
    </div>
  )
}
