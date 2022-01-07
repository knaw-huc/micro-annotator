import {AnnotatorRecogito} from './AnnotatorRecogito';
import {useAnnotationTypeContext} from './AnnotationTypeContext';
import {AnnotationListType} from '../list/AnnotationList';
import {browsableAnnotations} from '../list/AnnotationItem';
import {useCreatorContext} from '../creator/CreatorContext';
import {useSearchContext} from '../search/SearchContext';
import {Annotation} from '../../model/Annotation';

interface AnnotatorDocumentProps {
  onAddAnnotation: (ann: any) => void;
  onUpdateAnnotation: (ann: any) => void;
  text: string;
  selected: Annotation | undefined;
}

export const AnnotatorDocument = (props: AnnotatorDocumentProps) => {

  const creatorState = useCreatorContext().state;
  const searchState = useSearchContext().state;
  const annotationTypeState = useAnnotationTypeContext().state;

  let recogitoAnnotations;
  const displayUserAnnotations = annotationTypeState.annotationType === AnnotationListType.USER;
  if (displayUserAnnotations) {
    recogitoAnnotations = searchState.annotations
      .filter(a => !browsableAnnotations.includes(a.entity_type));
  } else {
    recogitoAnnotations = props.selected
      ? [props.selected]
      : [];
  }

  return <AnnotatorRecogito
    text={props.text}
    annotations={recogitoAnnotations}
    onAddAnnotation={props.onAddAnnotation}
    onUpdateAnnotation={props.onUpdateAnnotation}
    creator={creatorState.creator}
    readOnly={annotationTypeState.annotationType === AnnotationListType.RANGE}
  />;
};

