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
      <AddAnnotation selectionRange={props.getSelectionRange} onAdd={props.onAddAnnotation}/>
      <AnnotationList myAnnotations={props.myAnnotations} onSelectAnnotation={props.onSelectAnnotation}/>
      <AnnotationContent annotations={props.myAnnotations}/>
    </div>
  )
}
