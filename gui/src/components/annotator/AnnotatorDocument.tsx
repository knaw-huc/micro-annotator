import {AnnotationListType} from '../list/AnnotationList';
import {AnnotatorRecogito} from './AnnotatorRecogito';
import {browsableAnnotations} from '../list/AnnotationItem';
import {MicroAnnotation} from '../../model/Annotation';
import {useAnnotationTypeContext} from './AnnotationTypeContext';
import {useCreatorContext} from '../creator/CreatorContext';
import {useSearchContext} from '../search/SearchContext';
import {useSelectedAnnotationContext} from '../list/SelectedAnnotationContext';

interface AnnotatorDocumentProps {
  onAddAnnotation: (ann: any) => void;
  onUpdateAnnotation: (ann: any) => void;
}

export const AnnotatorDocument = (props: AnnotatorDocumentProps) => {

  const text = useSearchContext().state.annotatableText;
  const creator = useCreatorContext().state.creator;
  const searchState = useSearchContext().state;
  const annotationType = useAnnotationTypeContext().state.annotationType;
  const selectedAnnotation = useSelectedAnnotationContext().state.selected;

  const displayUserAnnotations = annotationType === AnnotationListType.USER;

  const displaySelectedAnnotation = annotationType === AnnotationListType.OVERLAPPING
    && selectedAnnotation
    && searchState.overlappingAnnotations.indexOf(selectedAnnotation) !== -1;

  let recogitoAnnotations: MicroAnnotation[];
  if (displayUserAnnotations) {
    recogitoAnnotations = searchState.userAnnotations
      .filter(a => !browsableAnnotations.includes(a.entity_type));
  } else if (displaySelectedAnnotation) {
    recogitoAnnotations = [selectedAnnotation];
  } else {
    recogitoAnnotations = [];
  }

  return <AnnotatorRecogito
    text={text.join('\n')}
    annotations={recogitoAnnotations}
    onAddAnnotation={props.onAddAnnotation}
    onUpdateAnnotation={props.onUpdateAnnotation}
    creator={creator}
    readOnly={annotationType === AnnotationListType.OVERLAPPING}
  />;
};

