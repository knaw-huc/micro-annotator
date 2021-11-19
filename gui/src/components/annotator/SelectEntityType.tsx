import {EntityType} from "../../model/EntityType";
import ComboBox, {ComboBoxItem} from "../common/ComboBox";

type SelectEntityTypeProps = {
  selected: string
  select: (option: string) => void
}

export default function SelectEntityType(props: SelectEntityTypeProps) {

  return <div className="form-control">
    <label>Pick an entity type</label>
    <ComboBox
      items={createOptions()}
      onSubmit={(i: ComboBoxItem) => props.select(i.value)}
    />
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
    return {value: value.name};
  });
}
