import Downshift from "downshift";

export type TypeaheadItem = {
  value: string
};

type TypeaheadProps = {
  placeholder: string,
  items: TypeaheadItem[],
  input: string,
  onType: (input: string) => void
  onSelect: (input: string) => void
};

export default function Typeahead(props: TypeaheadProps) {

  return <Downshift
    itemToString={(item) => (item ? item.value : '')}
  >
    {({
        getInputProps,
        getItemProps,
        getMenuProps,
        highlightedIndex,
        selectedItem,
        isOpen,
        openMenu,
        closeMenu
      }) => (
      <div className="combobox form-control form-control-small">
        <input
          {...getInputProps()}
          className="typeahead-input"
          value={props.input}
          onSelect={() => openMenu()}
          onChange={(e: React.FormEvent<HTMLInputElement>) => props.onType(e.currentTarget.value)}
        />
        <ul
          className="typeahead-menu"
          {...getMenuProps()}
        >
          {isOpen &&
          props.items
            .map((item, index) => (
              <li
                {...getItemProps({
                  key: `${item.value}${index}`,
                  item,
                  index,
                  style: {
                    backgroundColor:
                      highlightedIndex === index ? 'lightgray' : 'white',
                    fontWeight: selectedItem === item ? 'bold' : 'normal',
                  },
                })}
                onClick={(e: React.FormEvent<HTMLElement>) => {
                  let newValue = e.currentTarget.innerText;
                  console.log('click', newValue);
                  props.onSelect(newValue);
                  closeMenu()
                }}
              >
                {item.value}
              </li>
            ))}
        </ul>
      </div>
    )}
  </Downshift>;
}
