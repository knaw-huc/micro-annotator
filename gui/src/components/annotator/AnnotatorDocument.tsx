import {AnnotatorRecogito} from './AnnotatorRecogito';
import {useAnnotationTypeContext} from './AnnotationTypeContext';
import {AnnotationListType} from '../list/AnnotationList';
import {browsableAnnotations} from '../list/AnnotationItem';
import {useCreatorContext} from '../creator/CreatorContext';
import {useSearchContext} from '../search/SearchContext';
import {useSelectedAnnotationContext} from '../list/SelectedAnnotationContext';
import {MicroAnnotation} from '../../model/Annotation';

interface AnnotatorDocumentProps {
  onAddAnnotation: (ann: any) => void;
  onUpdateAnnotation: (ann: any) => void;
  text: string;
}

export const AnnotatorDocument = (props: AnnotatorDocumentProps) => {

  const creator = useCreatorContext().state.creator;
  const annotations = useSearchContext().state.annotations;
  const annotationType = useAnnotationTypeContext().state.annotationType;
  const selectedAnnotation = useSelectedAnnotationContext().state.selected;

  const displayUserAnnotations = annotationType === AnnotationListType.USER;

  const displaySelectedAnnotation = annotationType === AnnotationListType.RANGE
    && selectedAnnotation
    && annotations.indexOf(selectedAnnotation) !== -1;

  let recogitoAnnotations: MicroAnnotation[];
  if (displayUserAnnotations) {
    recogitoAnnotations = annotations
      .filter(a => !browsableAnnotations.includes(a.entity_type));
  } else if (displaySelectedAnnotation) {
    recogitoAnnotations = [selectedAnnotation];
  } else {
    recogitoAnnotations = []
  }

  return <AnnotatorRecogito
    text={props.text}
    annotations={recogitoAnnotations}
    onAddAnnotation={props.onAddAnnotation}
    onUpdateAnnotation={props.onUpdateAnnotation}
    creator={creator}
    readOnly={annotationType === AnnotationListType.RANGE}
  />;
};

