import {ChangeEvent} from "react";
import {EntityType} from "../model/EntityType";

type SelectEntityTypeProps = {
  selected: EntityType | undefined
  selectOption: (e: ChangeEvent<HTMLSelectElement>) => void
}

export default function SelectEntityType(props: SelectEntityTypeProps) {
  return <div className="form-control">
    <select
      id="formControlSelect"
      onChange={props.selectOption}
      value={props.selected ? props.selected : ""}
    >
      <option value="">Pick an entity type</option>
      {createOptions()}
    </select>
  </div>;
}

export const EntityTypes = [
  {
    name: EntityType.LOCATION,
    placeholder: 'Location'
  },
  {
    name: EntityType.ORGANIZATION,
    placeholder: 'Organization'
  },
  {
    name: EntityType.PERSON,
    placeholder: 'Person'
  }
];

function createOptions() {
  return Object.entries(EntityTypes).map(([name, value]) => {
    return <option
      key={name}
      value={value.name}
    >
      {value.placeholder}
    </option>
  });
}
