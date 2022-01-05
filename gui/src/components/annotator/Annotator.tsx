import {Annotation, MicroAnnotation} from '../../model/Annotation';
import AnnotationList, {AnnotationListType} from '../list/AnnotationList';
import {AnnotatorDocument} from './AnnotatorDocument';
import {browsableAnnotations} from '../list/AnnotationItem';

type RecogitoAnnotatorProps = {
  annotations: MicroAnnotation[];
  selected: Annotation | undefined;
  onSelect: (a: MicroAnnotation | undefined) => void;
  onSearch: (id: string) => void;
  onAddAnnotation: (ann: any) => void;
  onUpdateAnnotation: (ann: any) => void;
  text: string;
  creator: string;
  annotationType: AnnotationListType;
  onSetAnnotationType: (t: AnnotationListType) => void;
}

export default function Annotator(props: RecogitoAnnotatorProps) {
  const changeToUser = () => props.onSetAnnotationType(AnnotationListType.USER);
  const changeToRange = () => props.onSetAnnotationType(AnnotationListType.RANGE);

  const recogitoAnnotations = props.annotationType === AnnotationListType.USER
    ? props.annotations.filter(a => !browsableAnnotations.includes(a.entity_type))
    : props.selected !== undefined
      ? [props.selected]
      : [];

  return <>
    <div className="annotator-column">
      <AnnotatorDocument
        text={props.text}
        annotations={recogitoAnnotations}
        onAddAnnotation={props.onAddAnnotation}
        onUpdateAnnotation={props.onUpdateAnnotation}
        creator={props.creator}
        readOnly={props.annotationType === AnnotationListType.RANGE}
      />
    </div>
    <div className="annotator-column">
      <h4>Annotations</h4>
      <div className="tabs clearfix">
        <button
          className={'btn btn-block btn-tab' + (props.annotationType === AnnotationListType.USER ? '' : ' btn-tab-unselected')}
          onClick={changeToUser}
        >
          By user
        </button>
        <button
          className={'btn btn-block btn-tab' + (props.annotationType === AnnotationListType.RANGE ? '' : ' btn-tab-unselected')}
          onClick={changeToRange}
        >
          Overlap
        </button>
      </div>
      <AnnotationList
        annotations={props.annotations}
        selected={props.selected}
        onSelect={props.onSelect}
        onSearch={props.onSearch}
      />
    </div>
  </>;
}
