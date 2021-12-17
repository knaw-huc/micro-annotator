import {ElucidateAnnotation, EntityBodyType, RecogitoTargetType, TargetType} from "../../model/ElucidateAnnotation";
import {MicroAnnotation} from "../../model/Annotation";
import isString from "../isString";

/**
 * Add micro-annotator specific fields to Elucidate annotation
 */
export function toMicroAnn(a: ElucidateAnnotation, beginRange: number): MicroAnnotation {
  const result = a as MicroAnnotation;
  result.id = toAnnotationId(a.id);

  if (result.webAnn) {
    delete result.webAnn;
  }
  result.webAnn = JSON.parse(JSON.stringify(result));

  result.coordinates = fromTrUrlToCoordinates(findTextRepoUrl(a));
  result.entity_type = getEntityType(a);
  result.coordinates = toRelativeOffsets(result.coordinates, beginRange);

  if (Array.isArray(a.target)) {
    setRecogitoTargetSelector(a);
  }

  return result;
}

function findTextRepoUrl(ea: ElucidateAnnotation) {
  if (Array.isArray(ea.target)) {
    return (ea.target as TargetType[]).find(t => isString(t)) as string;
  } else if (isString(ea.target)) {
    return ea.target as string;
  } else {
    throw new Error('No target url');
  }
}

function getEntityType(ea: ElucidateAnnotation): string {
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

function fromTrUrlToCoordinates(textrepoTarget: string): number[] {
  const groups = textrepoTarget.match(/.*\/segments\/index\/(\d*)\/(\d*)\/(\d*)\/(\d*)/);
  if (!groups || groups.length !== 5) {
    throw Error('Cannot find coordinates in elucidate target: ' + textrepoTarget);
  }
  return [parseInt(groups[1]), parseInt(groups[2]), parseInt(groups[3]), parseInt(groups[4])];
}

/**
 * Annotation ID is the second UUID found in an elucidate ID
 */
function toAnnotationId(id: string) {
  return id.match(/[0-9a-f-]{36}/g)?.[1] as string;
}

/**
 * Relative to current text
 */
function toRelativeOffsets(c: number[], offset: number): number[] {
  c[0] -= offset;
  c[2] -= offset;
  return c;
}

/**
 * Recogito expects a.target.selector instead of a.target[*].selector:
 */
function setRecogitoTargetSelector(a: ElucidateAnnotation) {
  const target = a.target as any as RecogitoTargetType;
  const selectorTarget = (a.target as RecogitoTargetType[]).find(t => t.selector);
  if (selectorTarget) {
    target.selector = selectorTarget.selector;
  }
}

