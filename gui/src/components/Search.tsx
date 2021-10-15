import {useState} from 'react'
import Config from "../Config";


type SearchProps = {
  onSearch: (params: { id: string }) => void
}

export default function Search(props: SearchProps) {
  const [id, setID] = useState(Config.PLACEHOLDER_SEARCH_ID)

  const onSubmit = (e: any) => {
    e.preventDefault()
    if (!id) {
      return;
    }
    props.onSearch({id});
  }

  return <form className='add-form' onSubmit={onSubmit}>
    <div className='form-control'>
      <label>Annotation ID</label>
      <input
        type='text'
        value={id}
        onChange={e => setID(e.target.value)}
      />

    </div>

    <input type='submit' value='Search' className='btn btn-block'/>
  </form>;
}
