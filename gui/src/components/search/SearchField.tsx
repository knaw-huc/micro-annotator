import Typeahead, {TypeaheadItem} from '../common/Typeahead';
import {useEffect, useState} from 'react';
import Elucidate from '../../resources/Elucidate';
import {findBodyId} from '../../util/findBodyId';
import {useDebounce} from '../../util/useDebounce';
import {useNavigate} from 'react-router-dom';
import {usePrevious} from '../../util/usePrevious';
import {useSearchContext} from './SearchContext';

export default function SearchField() {
  const searchState = useSearchContext().state;
  const navigate = useNavigate();

  const annotationId = searchState.annotationId;
  const previousAnnotationId = usePrevious(annotationId);
  const [items, setItems] = useState<TypeaheadItem[]>([]);
  const [input, setInput] = useState<string>(annotationId);
  const debouncedInput = useDebounce<string>(input, 250);
  const previousInput = usePrevious(debouncedInput);

  useEffect(() => {
    if(previousAnnotationId !== annotationId) {
      setInput(annotationId);
    }
  }, [previousAnnotationId, annotationId]);

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
    if (debouncedInput === annotationId) {
      setItems([]);
      return;
    }

    Elucidate.getFirstPageByBodyIdPrefix(debouncedInput).then((found) => {
      if (!found) {
        setItems([]);
        return;
      }

      const ids = Array.from(new Set(
        found.map(findBodyId)
      ));

      const items = ids
        .filter(i => i)
        .sort()
        .slice(0, 10)
        .map(i => ({value: i} as TypeaheadItem));
      setItems(items);
    });

  }, [debouncedInput, previousInput, annotationId, setItems]);

  function handleSelected(selected: string) {
    if (selected === annotationId) {
      return;
    }

    setItems([]);
    navigate(`/annotation/${selected}`);
  }

  return <form className='add-form'>
    <div className='form-control'>
      <label>Annotation ID</label>
      <Typeahead
        items={items}
        input={input}
        selected={annotationId}
        onType={handleTyping}
        onSelect={handleSelected}
      />
    </div>
  </form>;
}

