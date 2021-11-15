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
          <h4>Annotations</h4>
          <div className="tabs clearfix">
            <button className="btn btn-block btn-tab">By user</button>
            <button className="btn btn-block btn-tab btn-tab-unselected">In range</button>
          </div>
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
