import {useState, useEffect} from 'react'

export default function AddAnnotation({selectionRange, onAdd}) {
    const [bodyValue, setBodyValue] = useState('')

    const [selRangeStr, setSelRangeStr] = useState('geen selectie gezet')

    useEffect(() => {
        setSelRangeStr(getSelRangeStr(selectionRange()));
    }, [setSelRangeStr, selectionRange])

    const onSubmit = (e) => {
        e.preventDefault()

        if (!bodyValue) {
            alert('Please add body text')
        }

        const selRange = selectionRange();
        const newAnnotation = {
            'resource_id': 'volume-1728',
            'label': 'entity',
            'begin_anchor': selRange.beginAnchor,
            'end_anchor': selRange.endAnchor,
            'begin_char_offset': selRange.beginOffset,
            'end_char_offset': selRange.endOffset,
            'id': 'annot_some_uuid',
            'entity_type': 'location',
            'entity_text': bodyValue
        }
        onAdd(newAnnotation);

        setBodyValue('')
    }

    const getSelRangeStr = (selRange) => {
        if (selRange !== undefined) {
            return '(' + selRange.beginAnchor + ',' +
                selRange.beginOffset + ')(' +
                selRange.endAnchor + ',' +
                selRange.endOffset + ')';
        } else {
            return 'No selection'
        }
    }

    return (
        <form className='add-form' onSubmit={onSubmit}>
            <div className='form-control'>
                <label>Selection range</label>
                <input
                    type='text'
                    value={selRangeStr}
                    readOnly
                />
            </div>
            <div className='form-control'>
                <label>Body Text</label>
                <input
                    type='text' placeholder='Add Body Text'
                    onChange={
                        (e) => setBodyValue(e.target.value)
                    }
                />
            </div>

            <input type='submit' value='Save Annotation' className='btn btn-block'/>
        </form>
    )
}
