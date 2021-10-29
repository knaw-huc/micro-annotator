import {FormEvent, useEffect, useState} from 'react'
import {Annotation} from "../model/Annotation";
import {AnnRange} from "../model/AnnRange";
import SelectEntityType from "./SelectEntityType";
import {toRangeStr} from "../util/toRangeStr";

type AddAnnotationProps = {
  currentCreator: string;
  selectedRange: AnnRange | undefined;
  onAdd: (ann: Annotation) => void
};

export default function AnnotationForm(props: AddAnnotationProps) {
  const [comment, setComment] = useState('')
  const [entityType, setEntityType] = useState('')
  const [selectedRangeLabel, setSelectedRangeLabel] = useState('geen selectie gezet')

  let selectedRange = props.selectedRange;

  useEffect(() => {
    if(!selectedRange) {
      return;
    }
    setSelectedRangeLabel(toRangeStr(selectedRange));
  }, [selectedRange, setSelectedRangeLabel])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!props.currentCreator) {
      alert('Please add creator')
      return;
    }
    if (!comment) {
      alert('Please add comment')
      return;
    }
    if (!entityType) {
      alert('Please set entity type')
      return;
    }
    if (selectedRange === undefined) {
      alert('Selection range undefined');
      return;
    }

    const newAnnotation = {
      label: 'entity',
      creator: props.currentCreator,
      begin_anchor: selectedRange.beginAnchor,
      end_anchor: selectedRange.endAnchor,
      begin_char_offset: selectedRange.beginOffset,
      end_char_offset: selectedRange.endOffset,
      entity_type: entityType,
      entity_comment: comment
    } as Annotation;

    setSelectedRangeLabel('');
    setEntityType('');
    setComment('');

    props.onAdd(newAnnotation);
  }

  return (
    <form className='add-form' onSubmit={onSubmit}>
      <div className='form-control'>
        <label>Selection range</label>
        <input
          type='text'
          value={selectedRangeLabel}
          placeholder='Make selection in text'
          readOnly
        />
      </div>
      <div className='form-control'>
        <SelectEntityType selected={entityType} select={(option: string) => setEntityType(option)} />
      </div>

      <div className='form-control'>
        <label>Comment</label>
        <input
          type='text'
          value={comment}
          placeholder='Add Comment'
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div className='form-control'>
        <label>Creator</label>
        <input
          type='text'
          value={props.currentCreator}
          disabled={true}
          placeholder='Add Creator'
        />
      </div>

      <input type='submit' value='Save Annotation' className='btn btn-block'/>
    </form>
  )
}
