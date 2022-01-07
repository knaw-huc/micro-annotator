import {Annotation, MicroAnnotation} from '../../model/Annotation';
import AnnotationList from '../list/AnnotationList';
import {AnnotatorDocument} from './AnnotatorDocument';
import AnnotationTypeField from './AnnotationTypeField';

type RecogitoAnnotatorProps = {
  annotations: MicroAnnotation[];
  selected: Annotation | undefined;
  onSelect: (a: MicroAnnotation | undefined) => void;
  onSearch: (id: string) => void;
  onAddAnnotation: (ann: any) => void;
  onUpdateAnnotation: (ann: any) => void;
  text: string;
}

export default function Annotator(props: RecogitoAnnotatorProps) {

  return <>
    <div className="annotator-column">
      <AnnotatorDocument
        text={props.text}
        onAddAnnotation={props.onAddAnnotation}
        onUpdateAnnotation={props.onUpdateAnnotation}
        selected={props.selected}
      />
    </div>
    <div className="annotator-column">
      <h4>Annotations</h4>
      <div>
        <AnnotationTypeField />
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
