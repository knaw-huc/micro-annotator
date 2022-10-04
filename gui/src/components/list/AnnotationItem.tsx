import {useEffect, useState} from 'react';
import AnnotationItemContent from './AnnotationItemContent';
import {findBodyId} from '../../util/findBodyId';
import {MicroAnnotation} from '../../model/Annotation';
import toRange from '../../util/convert/toRange';
import {toRangeStr} from '../../util/convert/toRangeStr';
import {useNavigate} from 'react-router-dom';
import {usePrevious} from '../../util/usePrevious';

type AnnotationSnippetProps = {
  annot_id: number,
  annotation: MicroAnnotation,
  selected: boolean,
  onSelect: (a: MicroAnnotation | undefined) => void
}

export const browsableAnnotations = ['scanpage'];

export default function AnnotationItem(props: AnnotationSnippetProps) {
  const browsable = browsableAnnotations.includes(props.annotation.entity_type);
  const [isOpen, setOpen] = useState(false);
  const previousIsOpen = usePrevious(isOpen);
  const navigate = useNavigate();

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
    //console.log(props.annotation);
  }, [isOpen, previousIsOpen, browsable, props]);

  return (
    <div className={'annotation-snippet'}>
      <div onClick={toggleOpen} className="clickable">
        {props.annotation.entity_type} {toRangeStr(toRange(props.annotation))}
        {browsable && <button className="btn btn-open-ann" onClick={() => navigate(`/annotation/${findBodyId(props.annotation)}`)}>
            🔎
        </button>}
      </div>
      {isOpen && <AnnotationItemContent ann={props.annotation}/>}
    </div>
  );
}
