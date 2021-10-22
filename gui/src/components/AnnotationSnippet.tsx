import {Annotation} from "../model/Annotation";
import {toRangeStr} from "../util/toRangeStr";
import {toRange} from "../model/AnnRange";
import AnnotationContent from "./AnnotationContent";

type AnnotationSnippetProps = {
  annot_id: number;
  annotation: Annotation;
  select: (a: Annotation | undefined) => void,
  selected: Annotation | undefined
}

export default function AnnotationSnippet(props: AnnotationSnippetProps) {
  function toggleSelection() {
    if (props.selected?.id === props.annotation.id) {
      props.select(undefined);
    } else {
      props.select(props.annotation);
    }
  }

  return (
    <div
      className={`annotation-snippet`}
    >
      <div
        onClick={toggleSelection}
        className="clickable"
      >
        {props.annotation.entity_type} {toRangeStr(toRange(props.annotation))}
      </div>
      {props.selected?.id === props.annotation.id ? <AnnotationContent ann={props.annotation}/> : null}
    </div>
  )
}
