export type Annotation = {
  id: string;
  resource_id: string;
  owner: string;
  label: string;
  entity_type: string;
  begin_char_offset: number;
  begin_anchor: number;
  end_char_offset: number;
  end_anchor: number;
  entity_text: string;
  selected: Boolean;
}
