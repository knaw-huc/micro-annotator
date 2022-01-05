import {useEffect, useState} from 'react';
import AnnotationItemSummery from './AnnotationItemSummery';
import {browsableAnnotations} from '../recogito/RecogitoAnnotator';
import {findBodyId} from '../../util/findBodyId';
import {MicroAnnotation} from '../../model/Annotation';
import {toRange} from '../../model/AnnRange';
import {toRangeStr} from '../../util/convert/toRangeStr';
import {usePrevious} from '../../util/usePrevious';

type AnnotationSnippetProps = {
  annot_id: number,
  annotation: MicroAnnotation,
  selected: boolean,
  onSelect: (a: MicroAnnotation | undefined) => void
  onSearch: (id: string) => void
}

export default function AnnotationItem(props: AnnotationSnippetProps) {
  const browsable = browsableAnnotations.includes(props.annotation.entity_type);
  const [isOpen, setOpen] = useState(false);
  const previousIsOpen = usePrevious(isOpen);

  function toggleOpen() {
    setOpen(!isOpen);
  }

  useEffect(() => {
    if (browsable) {
      // Browsable annotation cannot be shown in current selection
      return;
    }
    if (isOpen === previousIsOpen) {
      return;
    }
    if (props.selected) {
      props.onSelect(undefined);
    } else {
      props.onSelect(props.annotation);
    }
  }, [isOpen, previousIsOpen, browsable, props]);

  return (
    <div
      className={'annotation-snippet'}
    >
      <div
        onClick={toggleOpen}
        className="clickable"
      >
        {props.annotation.entity_type} {toRangeStr(toRange(props.annotation))}
        {browsable
          ? <button
            className="btn btn-open-ann"
            onClick={() => props.onSearch(findBodyId(props.annotation))}
          >
            🔎
          </button>
          : null}
      </div>
      {isOpen ? <AnnotationItemSummery ann={props.annotation}/> : null}
    </div>
  );
}
