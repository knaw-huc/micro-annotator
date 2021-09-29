import {Annotation} from "../model/Annotation";

type AnnotationContentProps = {
  ann: Annotation | undefined
}

export default function AnnotationContent(props: AnnotationContentProps) {
  const ann = props.ann;
  return ann
    ? <div className="annotation-content">
      <ul>
        <li>text: {ann.entity_text}</li>
        <li>resource: {ann.resource_id}</li>
        <li>id: {ann.id}</li>
        <li>annotation type: {ann.label}</li>
        <li>entity type: {ann.entity_type}</li>
        <li>begin anchor: {ann.begin_anchor}</li>
        <li>begin offset: {ann.begin_char_offset}</li>
        <li>end anchor: {ann.end_anchor}</li>
        <li>end offset: {ann.end_char_offset}</li>
        <li>creator: {ann.creator}</li>
      </ul>
    </div>
    : null;

};

