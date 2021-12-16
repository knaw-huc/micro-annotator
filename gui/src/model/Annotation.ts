import {ElucidateAnnotation, EntityBodyType, TargetType} from "./ElucidateAnnotation";
import isString from "../util/isString";


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
  coordinates: number[]
}

export type MicroAnnotation = ElucidateAnnotation & Annotation;

export function findTextRepoUrl(ea: ElucidateAnnotation) {
  if (Array.isArray(ea.target)) {
    return (ea.target as TargetType[]).find(t => isString(t)) as string;
  } else if (isString(ea.target)) {
    return ea.target as string;
  } else {
    throw new Error('No target url');
  }
}

export function getEntityType(ea: ElucidateAnnotation): string {
  const b = ea.body as EntityBodyType;

  const isClassifying = (body: any) => {
    return ["classifying", "tagging"].includes(body.purpose);
  }

  let entityType = Array.isArray(b)
    ? b.find(isClassifying)?.value
    : isClassifying(b) ? b.value : undefined;

  if (!entityType) {
    console.warn('No classifying TextualBody found in ' + JSON.stringify(b));
    return "recogito_entity_type";
  }
  return entityType;
}

export function fromTrUrlToCoordinates(textrepoTarget: string): number[] {
  const groups = textrepoTarget.match(/.*\/segments\/index\/(\d*)\/(\d*)\/(\d*)\/(\d*)/);
  if (!groups || groups.length !== 5) {
    throw Error('Cannot find coordinates in elucidate target: ' + textrepoTarget);
  }
  return [parseInt(groups[1]), parseInt(groups[2]), parseInt(groups[3]), parseInt(groups[4])];
}

/**
 * Annotation ID is the second UUID found in an elucidate ID
 */
export function toAnnotationId(id: string) {
  return id.match(/[0-9a-f-]{36}/g)?.[1] as string;
}

/**
 * Elucidate ID is an url with version ID followed by annotation ID
 */
export function toElucidateId(elucidateHost: string, versionId: string, annId: string) {
  return `${elucidateHost}/annotation/w3c/${versionId}/${annId}`;
}

/**
 * Relative to current text
 */
export function toRelativeOffsets(c: number[], offset: number): number[] {
  c[0] -= offset;
  c[2] -= offset;
  return c;
}

/**
 * Absolute, starting at beginning of corpus
 */
export function toAbsoluteOffsets(c: number[], offset: number) {
  c[0] += offset;
  c[2] += offset;
  return c;
}

export function isInRange(c: number[], endRange: number) {
  return c[0] >= 0 && c[2] <= endRange;
}

