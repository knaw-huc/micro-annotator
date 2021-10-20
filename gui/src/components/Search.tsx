import {useEffect, useState} from 'react'
import Config from "../Config";
import Typeahead, {TypeaheadItem} from "./Typeahead";
import Elucidate from "../resources/Elucidate";
import {ElucidateBodyType} from "../model/ElucidateAnnotation";
import useDebounce from "./useDebounce";
import {usePrevious} from "./usePrevious";


type SearchProps = {
  onSearch: (params: { id: string }) => void
}

export default function Search(props: SearchProps) {
  const [id, setId] = useState(Config.PLACEHOLDER_SEARCH_ID)
  const [items, setItems] = useState<TypeaheadItem[]>([]);
  const [input, setInput] = useState<string>(Config.PLACEHOLDER_SEARCH_ID);
  const debouncedInput = useDebounce<string>(input, 250)
  const previousInput = usePrevious(debouncedInput);

  const onSubmit = (e: any) => {
    e.preventDefault()
    if (!id) {
      return;

    }
    props.onSearch({id});
  }

  async function handleTyping(inputValue: string) {
    setInput(inputValue);
  }

  useEffect(() => {
    if(previousInput === debouncedInput) {
      return;
    }
    if (debouncedInput === id) {
      setItems([]);
      return;
    }

    Elucidate.getByIdPrefix(debouncedInput).then((found) => {
      if (!found) {
        setItems([]);
        return;
      }

      const foundIds = Array.from(new Set(
        found.map(i => (i.body as ElucidateBodyType).id)
      )).filter(i => i)
        .slice(0, 10)
        .map(i => {
          return {value: i}
        }).sort();
      setItems(foundIds)
    });

  }, [debouncedInput, previousInput, id, setItems])


  function handleSelected(selected: string) {
    if (selected === id) {
      return;
    }
    setId(selected);
    setInput(selected);
    setItems([]);
  }

  return <form className='add-form' onSubmit={onSubmit}>
    <div className='form-control'>
      <label>Annotation ID</label>
      <Typeahead
        placeholder={Config.PLACEHOLDER_SEARCH_ID}
        items={items}
        input={input}
        onType={handleTyping}
        onSelect={handleSelected}
      />
      <input
        type='submit'
        value={"Search: " + id}
        className='btn btn-block'
      />
    </div>
  </form>;
}

