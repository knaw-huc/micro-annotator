import {MicroAnnotation} from '../../model/Annotation';
import AnnotationList from '../list/AnnotationList';
import {AnnotatorDocument} from './AnnotatorDocument';
import AnnotationTypeField from './AnnotationTypeField';

type RecogitoAnnotatorProps = {
  annotations: MicroAnnotation[];
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
      />
    </div>
    <div className="annotator-column">
      <h4>Annotations</h4>
      <div>
        <AnnotationTypeField />
      </div>
      <AnnotationList
        annotations={props.annotations}
        onSearch={props.onSearch}
      />
    </div>
  </>;
}
