import {useCombobox} from "downshift";
import {useEffect, useState} from "react";

type ComboBoxProps = {
  items: ComboBoxItem[],
  onSubmit: (i: ComboBoxItem) => void
}

export type ComboBoxItem = {
  value: string
}
export default function ComboBox(props: ComboBoxProps) {

  let items = props.items.map(i => i.value);
  let onSubmit = props.onSubmit;

  const [inputItems, setInputItems] = useState(items);

  const [current, setCurrent] = useState('');
  useEffect(() => {
    onSubmit({value: current});
  }, [current, onSubmit]);

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({inputValue}) => {
      setCurrent(inputValue ? inputValue : '');
      setInputItems(
        items.filter(item =>
          item.toLowerCase().startsWith(inputValue ? inputValue.toLowerCase() : ''),
        ),
      )
    },
  });

  let arrowRight = 9655;
  let arrowDown = 9661;

  return (
    <>
      <div className="combobox" {...getComboboxProps()}>
        <input
          className="combobox-input"
          {...getInputProps()}
        />
        <button
          className="btn btn-block combobox-btn"
          type="button"
          {...getToggleButtonProps()}
          aria-label={'toggle menu'}
        >
          {String.fromCharCode(isOpen ? arrowRight : arrowDown)}
        </button>
      </div>
      <ul {...getMenuProps()} className="combobox-menu">
        {isOpen &&
        inputItems.map((item, index) => (
          <li
            style={
              highlightedIndex === index ? {backgroundColor: '#bde4ff'} : {}
            }
            key={`${item}${index}`}
            {...getItemProps({item, index})}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  )

}

