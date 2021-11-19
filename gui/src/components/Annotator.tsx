import AnnotationForm from './AnnotationForm'
import AnnotationList, {AnnotationListType} from './AnnotationList'
import {Annotation} from "../model/Annotation";
import {AnnRange} from "../model/AnnRange";

type AnnotatorProps = {
  currentCreator: string;
  selectionRange: AnnRange | undefined;
  onAddAnnotation: (ann: Annotation) => void;
  annotations: Annotation[];
  select: (a: Annotation | undefined) => void;
  selected: Annotation | undefined;
  setAnnotationType: (t: AnnotationListType) => void;
  annotationType: AnnotationListType;
}

export default function Annotator(props: AnnotatorProps) {
  const changeToUser = () => props.setAnnotationType(AnnotationListType.USER)
  const changeToRange = () => props.setAnnotationType(AnnotationListType.RANGE)

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
      <h4>Annotations</h4>
      <div className="tabs clearfix">
        <button
          className={"btn btn-block btn-tab" + (props.annotationType === AnnotationListType.USER ? '' : ' btn-tab-unselected')}
          onClick={changeToUser}
        >
          By user
        </button>
        <button
          className={"btn btn-block btn-tab" + (props.annotationType === AnnotationListType.RANGE ? '' : ' btn-tab-unselected')}
          onClick={changeToRange}
        >
          In range
        </button>
      </div>
      {props.annotations.length
        ? <>
          <AnnotationList
            annotations={props.annotations}
            select={props.select}
            selected={props.selected}
          />
        </>
        : <>(No annotations)</>
      }

    </div>
  )
}
