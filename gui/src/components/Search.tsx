import {useEffect, useState} from 'react'
import Typeahead, {TypeaheadItem} from "./common/Typeahead";
import Elucidate from "../resources/Elucidate";
import {useDebounce} from "../util/useDebounce";
import {usePrevious} from "../util/usePrevious";
import {findBodyId} from '../util/findBodyId';

type SearchProps = {
  searchId: string;
  onSearch: (id: string) => void;
}

export default function Search(props: SearchProps) {
  const [items, setItems] = useState<TypeaheadItem[]>([]);
  const [input, setInput] = useState<string>('');
  const debouncedInput = useDebounce<string>(input, 250)
  const previousInput = usePrevious(debouncedInput);
  const previousSearchId = usePrevious(props.searchId);

  useEffect(() => {
    if(previousSearchId !== props.searchId) {
      setInput(props.searchId);
    }
  }, [previousSearchId, props.searchId]);

  async function handleTyping(inputValue: string) {
    setInput(inputValue);
  }

  // Display suggestions:
  useEffect(() => {
    // Wait until input is debounced:
    if (!debouncedInput || debouncedInput === previousInput) {
      return;
    }

    // Remove suggestions when input matches picked search id:
    if (debouncedInput === props.searchId) {
      setItems([]);
      return;
    }

    Elucidate.getFirstPageByBodyIdPrefix(debouncedInput).then((found) => {
      if (!found) {
        setItems([]);
        return;
      }

      let ids = Array.from(new Set(
        found.map(findBodyId)
      ));

      const items = ids
        .filter(i => i)
        .sort()
        .slice(0, 10)
        .map(i => {
          return {value: i} as TypeaheadItem
        });
      setItems(items)
    });

  }, [debouncedInput, previousInput, props.searchId, setItems])

  function handleSelected(selected: string) {
    if (selected === props.searchId) {
      return;
    }

    setItems([]);
    props.onSearch(selected);
  }

  return <form className='add-form'>
    <div className='form-control'>
      <label>Annotation ID</label>
      <Typeahead
        items={items}
        input={input}
        selected={props.searchId}
        onType={handleTyping}
        onSelect={handleSelected}
      />
    </div>
  </form>;
}

