import {useState} from 'react'

type SearchProps = {
  onSearch: (params: any) => void
}

export default function Search(props: SearchProps) {
    const [id, setID] = useState('')

    const onSubmit = (e: any) => {
        e.preventDefault()
        if (!id) {
            return;
        }
        props.onSearch({id})
    }

    return <form className='add-form' onSubmit={onSubmit}>
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
        </form>;
}
