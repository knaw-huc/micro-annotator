import {MicroAnnotation} from '../../model/Annotation';
import AnnotationItem from './AnnotationItem';
import {useSelectedAnnotationContext} from './SelectedAnnotationContext';

type AnnotationListProps = {
  annotations: MicroAnnotation[];
  onSearch: (id: string) => void;
}

export enum AnnotationListType {
  USER = 'user',
  RANGE = 'range'
}

export default function AnnotationList(props: AnnotationListProps) {

  const selectedAnnotation = useSelectedAnnotationContext().state.selected;
  const setSelectedAnnotationState = useSelectedAnnotationContext().setState;

  return (
    <div>
      {props.annotations.map((annotation, index) => (
        <AnnotationItem
          key={index}
          annot_id={index}
          annotation={annotation}
          selected={selectedAnnotation?.id === annotation.id}
          onSelect={(selected) => setSelectedAnnotationState({selected})}
          onSearch={props.onSearch}
        />
      ))}
    </div>
  );
}
