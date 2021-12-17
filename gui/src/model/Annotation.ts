import {ElucidateAnnotation} from "./ElucidateAnnotation";

export type Annotation = {
  id: string;
  resource_id: string;
  creator: string;
  label: string;
  entity_type: string;
  begin_char_offset: number;
  begin_anchor: number;
  end_char_offset: number;
  end_anchor: number;
  entity_comment: string;
  selected: Boolean;
  webAnn: any
  coordinates: number[]
}

export type MicroAnnotation = ElucidateAnnotation & Annotation;

export const CUSTOM_NS = "http://example.org/customwebannotationfield";
export const ENTITY = "Entity";
export const ENTITY_CONTEXT = ["http://www.w3.org/ns/anno.jsonld", {"Entity": CUSTOM_NS + '#' + ENTITY}];

