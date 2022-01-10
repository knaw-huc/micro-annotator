import AnnotationItem from './AnnotationItem';
import {MicroAnnotation} from '../../model/Annotation';
import {useSearchContext} from '../search/SearchContext';
import {useSelectedAnnotationContext} from './SelectedAnnotationContext';

type AnnotationListProps = {
  onSelect: (id: string) => void;
}

export enum AnnotationListType {
  USER = 'user',
  RANGE = 'range'
}

export default function AnnotationList(props: AnnotationListProps) {

  const annotations = useSearchContext().state.annotations;
  const selectedAnnotation = useSelectedAnnotationContext().state.selected;
  const setSelectedAnnotationState = useSelectedAnnotationContext().setState;


  function handleSelected(selected: MicroAnnotation | undefined) {
    return setSelectedAnnotationState({selected});
  }

  return (
    <div>
      {annotations.map((annotation, index) => (
          <AnnotationItem
            key={index}
            annot_id={index}
            annotation={annotation}
            selected={selectedAnnotation?.id === annotation.id}
            onSelect={handleSelected}
            onSearch={props.onSelect}
          />
        )
      )}
    </div>
  );
}
