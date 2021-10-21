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
  const [input, setInput] = useState<string>(id);
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
    if (previousInput === debouncedInput) {
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
        found.map(i => {
          if (Array.isArray(i.body)) {
            return (i.body[0] as ElucidateBodyType).id
          } else {
            return (i.body as ElucidateBodyType).id
          }
        })
      )).filter(i => i)
        .slice(0, 10)
        .sort()
        .map(i => {
          return {value: i}
        });
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
        items={items}
        input={input}
        selected={id}
        onType={handleTyping}
        onSelect={handleSelected}
      />
      <input
        type='submit'
        value="Search"
        className={'btn btn-block' + (id !== input ? ' disabled' : '')}
        disabled={id !== input}
      />
    </div>
  </form>;
}

