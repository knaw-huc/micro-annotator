import {FormEvent, useEffect, useState} from 'react'
import {Annotation} from "../model/Annotation";
import {AnnRange} from "../model/AnnRange";
import SelectEntityType from "./SelectEntityType";
import {EntityType, fromValue} from "../model/EntityType";

type AddAnnotationProps = {
  getSelectionRange: () => AnnRange | undefined;
  onAdd: (ann: Annotation) => void
};

export default function AddAnnotation(props: AddAnnotationProps) {
  const [bodyValue, setBodyValue] = useState('')
  const [entityType, setEntityType] = useState<EntityType>()

  const [selRangeStr, setSelRangeStr] = useState('geen selectie gezet')

  let getSelectionRange = props.getSelectionRange;

  useEffect(() => {
    setSelRangeStr(toString(getSelectionRange()));
  }, [setSelRangeStr, getSelectionRange])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!bodyValue) {
      alert('Please add body text')
      return;
    }

    const range = getSelectionRange();

    if (range === undefined) {
      alert('Selection range undefined');
      return;
    }

    const newAnnotation = {
      resource_id: 'volume-1728',
      label: 'entity',
      begin_anchor: range.beginAnchor,
      end_anchor: range.endAnchor,
      begin_char_offset: range.beginOffset,
      end_char_offset: range.endOffset,
      id: 'annot_some_uuid',
      entity_type: entityType,
      entity_text: bodyValue
    } as Annotation;

    props.onAdd(newAnnotation);

    setBodyValue('')
  }

  const toString = (range: AnnRange | undefined) => {
    if (range === undefined) {
      return ''
    }
    return '('
      + range.beginAnchor + ','
      + range.beginOffset + ')('
      + range.endAnchor + ','
      + range.endOffset + ')';
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
        <label>Body Text</label>
        <input
          type='text'
          placeholder='Add Body Text'
          onChange={(e) => setBodyValue(e.target.value)}
        />
      </div>

      <input type='submit' value='Save Annotation' className='btn btn-block'/>
    </form>
  )
}
