import {ElucidateAnnotation, ElucidateBodyType} from "./ElucidateAnnotation";

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

export function toAnnotation(ea: ElucidateAnnotation) : Annotation{
  const result = {} as Annotation;
  result.id = ea.id.match(/[0-9a-f-]{36}/)?.[0] as string;
  result.label = (ea.body as ElucidateBodyType).value;
  let c = toCoordinates(ea.target as string);
  result.begin_anchor = c[0];
  result.begin_char_offset = c[1];
  result.end_anchor =c[2];
  result.end_char_offset = c[3];
  return result;
}

export function toCoordinates(elucidateTarget: string): number[]{
  const groups = elucidateTarget.match(/.*\/segments\/index\/(\d*)\/(\d*)\/(\d*)\/(\d*)/);
  if(!groups || groups.length !== 5) {
    throw Error('Cannot find coordinates in elucidate target: ' + elucidateTarget);
  }
  return [parseInt(groups[1]), parseInt(groups[2]), parseInt(groups[3]), parseInt(groups[4])];
}
