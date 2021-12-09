import {
  ClassifyingEntityBodyType,
  ElucidateAnnotation,
  ElucidateTargetType,
  EntityBodyType
} from "./ElucidateAnnotation";


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
  webAnn: any
}

export type MicroAnnotation = ElucidateAnnotation & Annotation;

/**
 * Add MicroAnnotation fields to Elucidate annotation
 */
export function toMicroAnn(ea: ElucidateAnnotation): MicroAnnotation {
  const result = ea as MicroAnnotation;

  if(!result.webAnn) {
    result.webAnn = JSON.parse(JSON.stringify(result));
  }

  // ID contains url with version ID followed by annotation ID:
  result.id = ea.id.match(/[0-9a-f-]{36}/g)?.[1] as string;
  let type = ea.type;
  result.label = getType(type);
  if (result.label === ENTITY) {
    return fromUserAnnToAnnotation(result);
  } else {
    return fromUntanngleAnnToAnnotation(result);
  }
}

function fromUntanngleAnnToAnnotation(ann: MicroAnnotation) {
  ann.entity_type = getEntityType(ann);
  let c = fromUntanngleToCoordinates(ann.target as ElucidateTargetType[]);
  ann.begin_anchor = c[0];
  ann.begin_char_offset = c[1];
  ann.end_anchor = c[2];
  ann.end_char_offset = c[3];
  return ann;
}

function fromUserAnnToAnnotation(ann: MicroAnnotation) {
  ann.entity_type = getEntityType(ann);
  ann.entity_comment = getEntityComment(ann);

  let c = fromUserAnnToCoordinates(ann.target as string);
  ann.begin_anchor = c[0];
  ann.begin_char_offset = c[1];
  ann.end_anchor = c[2];
  ann.end_char_offset = c[3];
  return ann;
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
  const b = ea.body as ClassifyingEntityBodyType;
  let entityText = b.find(b => b.purpose === "commenting")?.value;
  if (!entityText) {
    throw Error('No commenting TextualBody found in ' + JSON.stringify(b));
  }
  return entityText;
}

function getEntityType(ea: ElucidateAnnotation): string {
  const b = ea.body as EntityBodyType;

  const isClassifying = (body: any) => {
    return body.purpose === "classifying";
  }

  let entityType = Array.isArray(b)
    ? b.find(isClassifying)?.value
    : isClassifying(b) ? b.value : undefined;

  if (!entityType) {
    throw Error('No classifying TextualBody found in ' + JSON.stringify(b));
  }
  return entityType;
}

export function fromUserAnnToCoordinates(textrepoTarget: string): number[] {
  const groups = textrepoTarget.match(/.*\/segments\/index\/(\d*)\/(\d*)\/(\d*)\/(\d*)/);
  if (!groups || groups.length !== 5) {
    throw Error('Cannot find coordinates in elucidate target: ' + textrepoTarget);
  }
  return [parseInt(groups[1]), parseInt(groups[2]), parseInt(groups[3]), parseInt(groups[4])];
}

export function fromUntanngleToCoordinates(targets: any[]): number[] {
  const target = targets.find(t => t.selector.type === 'urn:example:republic:TextAnchorSelector');
  return [target.selector.start, 0, target.selector.end + 1, 0]
}

/**
 * Relative to current text
 */
export function toRelativeOffsets(a: Annotation, offset: number): Annotation {
  a.begin_anchor -= offset;
  a.end_anchor -= offset;
  return a;
}

/**
 * Absolute, starting at beginning of corpus
 */
export function toAbsoluteOffsets(a: Annotation, offset: number) {
  a.begin_anchor += offset;
  a.end_anchor += offset;
  return a;
}

export function isInRange(ann: Annotation, endRange: number) {
  return ann.begin_anchor >= 0 && ann.end_anchor <= endRange;
}

