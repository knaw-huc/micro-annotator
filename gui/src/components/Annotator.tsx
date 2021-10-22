import AnnotationForm from './AnnotationForm'
import AnnotationList from './AnnotationList'
import {Annotation} from "../model/Annotation";
import {AnnRange} from "../model/AnnRange";

type AnnotatorProps = {
  currentCreator: string;
  selectionRange: AnnRange | undefined;
  onAddAnnotation: (ann: Annotation) => void;
  myAnnotations: Annotation[];
  select: (a: Annotation | undefined) => void;
  selected: Annotation | undefined;
}

export default function Annotator(props: AnnotatorProps) {
  return (
    <div style={{'minWidth': '150px', 'width': '280px'}}>
      <h4>Annotator</h4>
      {props.selectionRange
        ? <AnnotationForm
          currentCreator={props.currentCreator}
          selectedRange={props.selectionRange}
          onAdd={props.onAddAnnotation}
        />
        : <small>Select text to create an annotation</small>
      }
      {props.myAnnotations.length
        ? <>
          <h4>Existing user annotations</h4>
          <AnnotationList
            myAnnotations={props.myAnnotations}
            select={props.select}
            selected={props.selected}
          />
        </>
        : null
      }

    </div>
  )
}
