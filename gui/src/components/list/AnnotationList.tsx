import AnnotationItem from './AnnotationItem';
import {useSelectedAnnotationContext} from './SelectedAnnotationContext';
import {useSearchContext} from '../search/SearchContext';

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

  return (
    <div>
      {annotations.map((annotation, index) => (
        <AnnotationItem
          key={index}
          annot_id={index}
          annotation={annotation}
          selected={selectedAnnotation?.id === annotation.id}
          onSelect={(selected) => setSelectedAnnotationState({selected})}
          onSearch={props.onSelect}
        />
      ))}
    </div>
  );
}
