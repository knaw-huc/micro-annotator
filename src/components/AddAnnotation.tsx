import {useState, useEffect} from 'react'
import {Annotation} from "../model/Annotation";
import {AnnRange} from "../model/AnnRange";

type AddAnnotationProps = {
  selectionRange: () => AnnRange | undefined;
  onAdd: (ann: Annotation) => void
};

export default function AddAnnotation(props: AddAnnotationProps) {
  const [bodyValue, setBodyValue] = useState('')

  const [selRangeStr, setSelRangeStr] = useState('geen selectie gezet')

  let getSelRange = props.selectionRange;
  useEffect(() => {
    setSelRangeStr(toString(getSelRange()));
  }, [setSelRangeStr, getSelRange])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!bodyValue) {
      alert('Please add body text')
    }

    const selRange = getSelRange();

    if (selRange === undefined) {
      return 'Selection range undefined';
    }

    const newAnnotation = {
      resource_id: 'volume-1728',
      label: 'entity',
      begin_anchor: selRange.beginAnchor,
      end_anchor: selRange.endAnchor,
      begin_char_offset: selRange.beginOffset,
      end_char_offset: selRange.endOffset,
      id: 'annot_some_uuid',
      entity_type: 'location',
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
        <label>Body Text</label>
        <input
          type='text'
          placeholder='Add Body Text'
          onChange={
            (e) => setBodyValue(e.target.value)
          }
        />
      </div>

      <input type='submit' value='Save Annotation' className='btn btn-block'/>
    </form>
  )
}
