import AnnotationList, {AnnotationListType} from "../annotator/AnnotationList";
import {Annotation} from "../../model/Annotation";
import RecogitoDocument from "./RecogitoDocument";

type RecogitoAnnotatorProps = {
  annotations: Annotation[];
  selected: Annotation | undefined;
  onSelect: (a: Annotation | undefined) => void;
  onAddAnnotation: (ann: any) => void;
  text: string;
  creator: string;
  annotationType: AnnotationListType;
  onSetAnnotationType: (t: AnnotationListType) => void;
}
export default function RecogitoAnnotator(props: RecogitoAnnotatorProps) {
  const changeToUser = () => props.onSetAnnotationType(AnnotationListType.USER)
  const changeToRange = () => props.onSetAnnotationType(AnnotationListType.RANGE)

  const recogitoAnnotations = props.annotationType === AnnotationListType.USER
    ? props.annotations
    : props.selected !== undefined
      ? [props.selected]
      : [];

  return <>
    <div className="annotator-column">
      <RecogitoDocument
        text={props.text}
        annotations={recogitoAnnotations}
        onAddAnnotation={props.onAddAnnotation}
        creator={props.creator}
      />
    </div>
    <div className="annotator-column">
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
      <AnnotationList
        annotations={props.annotations}
        selected={props.selected}
        onSelect={props.onSelect}
      />
    </div>
  </>
}
