import AddAnnotation from './AddAnnotation'
import AnnotationList from './AnnotationList'
import AnnotationContent from './AnnotationContent'
import {Annotation} from "../model/Annotation";
import {AnnRange} from "../model/AnnRange";

type AnnotatorProps = {
  getSelectionRange: () => AnnRange | undefined;
  onAddAnnotation: (ann: Annotation) => void;
  onSelectAnnotation: (ann: number) => void,
  myAnnotations: Annotation[]
}

export default function Annotator(props: AnnotatorProps) {
  return (
    <div style={{'minWidth': '150px'}}>
      <div>
        Annotator
      </div>
      {props.getSelectionRange()
        ? <AddAnnotation getSelectionRange={props.getSelectionRange} onAdd={props.onAddAnnotation}/>
        : <small>To create an annotation, select some text...</small>
      }
      {props.myAnnotations.length
        ? <>
          <AnnotationList myAnnotations={props.myAnnotations} onSelectAnnotation={props.onSelectAnnotation}/>
          <AnnotationContent ann={props.myAnnotations.find(a => a.selected)}/>
        </>
        : null
      }

    </div>
  )
}
