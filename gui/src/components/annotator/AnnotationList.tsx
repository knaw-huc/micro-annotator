import AnnotationItem from './AnnotationItem'
import {Annotation, MicroAnnotation} from "../../model/Annotation";

type AnnotationListProps = {
  annotations: MicroAnnotation[];
  selected: Annotation | undefined;
  onSelect: (a: MicroAnnotation | undefined) => void;
  onSearch: (id: string) => void;
}

export enum AnnotationListType {
  USER = 'user',
  RANGE = 'range'
}

export default function AnnotationList(props: AnnotationListProps) {
  return (
    <div>
      {props.annotations.map((annotation, index) => (
        <AnnotationItem
          key={index}
          annot_id={index}
          annotation={annotation}
          selected={props.selected?.id === annotation.id}
          onSelect={props.onSelect}
          onSearch={props.onSearch}
        />
      ))}
    </div>
  )
}
