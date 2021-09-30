import {Annotation} from "../model/Annotation";
import {toRangeStr} from "../util/toRangeStr";
import {toRange} from "../model/AnnRange";
import AnnotationContent from "./AnnotationContent";
import { useState } from "react";

type AnnotationSnippetProps = {
  annot_id: number;
  annotation: Annotation;
}

export default function AnnotationSnippet(props: AnnotationSnippetProps) {
  const [selected, setSelected] = useState(false)
  return (
    <div
      className={`annotation-snippet ${selected ? 'selection' : ''}`}
      onClick={() => setSelected(!selected)}
    >
      {props.annotation.entity_type} {toRangeStr(toRange(props.annotation))}
      {selected ? <AnnotationContent ann={props.annotation}/> : null}
    </div>
  )
}
