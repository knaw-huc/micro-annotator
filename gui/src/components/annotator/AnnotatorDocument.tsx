import {AnnotatorRecogito} from './AnnotatorRecogito';

interface AnnotatorDocumentProps {
  onAddAnnotation: (ann: any) => void;
  onUpdateAnnotation: (ann: any) => void;
  annotations: {}[];
  text: string;
  creator: string;
  readOnly: boolean;
}

export const AnnotatorDocument = (props: AnnotatorDocumentProps) => {

  return <AnnotatorRecogito
    text={props.text}
    annotations={props.annotations}
    onAddAnnotation={props.onAddAnnotation}
    onUpdateAnnotation={props.onUpdateAnnotation}
    creator={props.creator}
    readOnly={props.readOnly}
  />;
};

