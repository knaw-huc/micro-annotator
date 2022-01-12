import AnnotationItem from './AnnotationItem';
import {MicroAnnotation} from '../../model/Annotation';
import {useAnnotationTypeContext} from '../annotator/AnnotationTypeContext';
import {useSearchContext} from '../search/SearchContext';
import {useSelectedAnnotationContext} from './SelectedAnnotationContext';

export enum AnnotationListType {
  USER = 'user',
  OVERLAPPING = 'overlap'
}

export default function AnnotationList() {

  const searchContext = useSearchContext()
    .state;
  const selectedAnnotation = useSelectedAnnotationContext()
    .state
    .selected;
  const setSelectedAnnotationState = useSelectedAnnotationContext()
    .setState;
  const annotationType = useAnnotationTypeContext()
    .state
    .annotationType;

  const annotations = annotationType === AnnotationListType.USER
    ? searchContext.userAnnotations
    : searchContext.overlappingAnnotations;

  function handleSelected(selected: MicroAnnotation | undefined) {
    return setSelectedAnnotationState({selected});
  }

  return (
    <div>
      {annotations && annotations.map((annotation, index) => (
          <AnnotationItem
            key={index}
            annot_id={index}
            annotation={annotation}
            selected={selectedAnnotation?.id === annotation.id}
            onSelect={handleSelected}
          />
        )
      )}
    </div>
  );
}
