import {useState} from 'react'

export default function Search({onSearch}) {
    const [id, setID] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()
        if (!id) {
            return;
        }
        onSearch({id})
    }

    return (
        <form className='add-form' onSubmit={onSubmit}>
            <div className='form-control'>
                <label>Annotation ID</label>
                <input
                    type='text'
                    placeholder='Please enter annotation id' value={id}
                    onChange={
                        (e) => setID(e.target.value)
                    }
                />
            </div>

            <input type='submit' value='Search' className='btn btn-block'/>
        </form>
    )
}
