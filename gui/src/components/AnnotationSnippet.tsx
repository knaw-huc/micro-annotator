import {Annotation} from "../model/Annotation";
import {toRangeStr} from "../util/toRangeStr";
import {toRange} from "../model/AnnRange";
import AnnotationContent from "./AnnotationContent";

type AnnotationSnippetProps = {
  annot_id: number;
  annotation: Annotation;
  selected: Annotation | undefined
  onSelect: (a: Annotation | undefined) => void,
}

export default function AnnotationSnippet(props: AnnotationSnippetProps) {
  function toggleSelection() {
    if (props.selected?.id === props.annotation.id) {
      props.onSelect(undefined);
    } else {
      props.onSelect(props.annotation);
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
