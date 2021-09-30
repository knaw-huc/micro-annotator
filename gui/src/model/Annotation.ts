import {ElucidateAnnotation, EntityBodyType} from "./ElucidateAnnotation";

export const NS_PREFIX = "http://example.org/customwebannotationfield#";
export const ENTITY = "Entity";

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
  source: any
}

export function toAnnotation(ea: ElucidateAnnotation): Annotation {
  const result = {} as Annotation;
  result.creator = ea.creator;

  // Elucidate id contains version ID followed by annotation ID:
  result.id = ea.id.match(/[0-9a-f-]{36}/g)?.[1] as string;
  let type = ea.type;

  result.label = getType(type);

  if (result.label !== ENTITY) {
    return result;
  }
  result.entity_comment = getEntityComment(ea);
  result.entity_type = getEntityType(ea);

  let c = toCoordinates(ea.target as string);
  result.begin_anchor = c[0];
  result.begin_char_offset = c[1];
  result.end_anchor = c[2];
  result.end_char_offset = c[3];
  result.source = ea;
  return result;
}

function getType(type: string | string[]) {
  if (!Array.isArray(type)) {
    return type;
  }
  if (type.length === 1) {
    return type[0];
  }

  let found = type.find(t => t !== "Annotation");
  if (found) {
    return found.split('#').pop() as string;
  } else {
    throw Error('Could not find type in ' + JSON.stringify(type));
  }
}
function getEntityComment(ea: ElucidateAnnotation) {
  const b = ea.body as EntityBodyType;
  let entityText = b.find(b => b.purpose === "commenting")?.value;
  if (!entityText) {
    throw Error('No commenting TextualBody found in ' + JSON.stringify(b));
  }
  return entityText;
}

function getEntityType(ea: ElucidateAnnotation) {
  const b = ea.body as EntityBodyType;
  let entityType = b.find(b => b.purpose === "classifying")?.value;
  if (!entityType) {
    throw Error('No classifying TextualBody found in ' + JSON.stringify(b));
  }
  return entityType;
}

export function toCoordinates(textrepoTarget: string): number[] {
  const groups = textrepoTarget.match(/.*\/segments\/index\/(\d*)\/(\d*)\/(\d*)\/(\d*)/);
  if (!groups || groups.length !== 5) {
    throw Error('Cannot find coordinates in elucidate target: ' + textrepoTarget);
  }
  return [parseInt(groups[1]), parseInt(groups[2]), parseInt(groups[3]), parseInt(groups[4])];
}
