import {FormEvent, useEffect, useState} from 'react'
import {Annotation} from "../model/Annotation";
import {AnnRange} from "../model/AnnRange";
import SelectEntityType from "./SelectEntityType";
import {EntityType, fromValue} from "../model/EntityType";
import {toRangeStr} from "../util/toRangeStr";

type AddAnnotationProps = {
  selectedRange: AnnRange | undefined;
  onAdd: (ann: Annotation) => void
};

export default function AddAnnotation(props: AddAnnotationProps) {
  const [bodyValue, setBodyValue] = useState('')
  const [entityType, setEntityType] = useState<EntityType>()
  const [selRangeStr, setSelRangeStr] = useState('geen selectie gezet')

  let selectedRange = props.selectedRange;

  useEffect(() => {
    if(!selectedRange) {
      return;
    }
    setSelRangeStr(toRangeStr(selectedRange));
  }, [selectedRange, setSelRangeStr])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!bodyValue) {
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
      begin_anchor: selectedRange.beginAnchor,
      end_anchor: selectedRange.endAnchor,
      begin_char_offset: selectedRange.beginOffset,
      end_char_offset: selectedRange.endOffset,
      entity_type: entityType,
      entity_text: bodyValue
    } as Annotation;

    setSelRangeStr('')
    setEntityType(undefined)
    setBodyValue('')

    props.onAdd(newAnnotation);
  }

  return (
    <form className='add-form' onSubmit={onSubmit}>
      <div className='form-control'>
        <label>Selection range</label>
        <input
          type='text'
          value={selRangeStr}
          placeholder='Make selection in text'
          readOnly
        />
      </div>
      <div className='form-control'>
        <SelectEntityType selected={entityType} selectOption={(e) => setEntityType(fromValue(e.target.value))} />
      </div>

      <div className='form-control'>
        <label>Comment</label>
        <input
          type='text'
          value={bodyValue}
          placeholder='Add Comment'
          onChange={(e) => setBodyValue(e.target.value)}
        />
      </div>

      <input type='submit' value='Save Annotation' className='btn btn-block'/>
    </form>
  )
}
