import {Annotation} from "../model/Annotation";

type AnnotationContentProps = {
  annotations: Annotation[]
}

export default function AnnotationContent(props: AnnotationContentProps) {
  return (
    <div
      style={{padding: '20px', fontSize: '11px', borderStyle: 'solid', borderColor: 'black', borderWidth: '1px'}}>
      {props.annotations.map((ann, index) => ann.selected
        ? <ul key={index}>
          <li>text: {ann.entity_text}</li>
          <li>resource: {ann.resource_id}</li>
          <li>id: {ann.id}</li>
          <li>annotation type: {ann.label}</li>
          <li>entity type: {ann.entity_type}</li>
          <li>begin anchor: {ann.begin_anchor}</li>
          <li>begin offset: {ann.begin_char_offset}</li>
          <li>end anchor: {ann.end_anchor}</li>
          <li>end offset: {ann.end_char_offset}</li>
        </ul>
        : null
      )}
    </div>
  )
};

