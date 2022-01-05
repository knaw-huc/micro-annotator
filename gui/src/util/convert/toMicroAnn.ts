import {
  ElucidateAnnotation,
  EntityBody,
  RecogitoPositionSelector,
  RecogitoTarget,
  SelectorTarget,
  Target
} from '../../model/ElucidateAnnotation';
import isString from '../isString';
import {MicroAnnotation} from '../../model/Annotation';
import {toLineCount} from './toLineCount';

/**
 * Add micro-annotator specific fields to Elucidate annotation
 */
export function toMicroAnn(a: ElucidateAnnotation, beginRange: number, text: string[]): MicroAnnotation {
  const result = a as MicroAnnotation;
  result.id = toAnnotationId(a.id);

  if (result.webAnn) {
    delete result.webAnn;
  }
  result.webAnn = JSON.parse(JSON.stringify(result));

  const trUrl = findTextRepoUrl(a);
  if(trUrl) {
    result.coordinates = fromTrUrlToCoordinates(trUrl);
  }else {
    result.coordinates = fromTrSelectorToCoordinates(a.target as Target[]);
  }
  result.coordinates = toRelativeOffsets(result.coordinates, beginRange);
  result.entity_type = getEntityType(a);

  if (Array.isArray(a.target)) {
    createRecogitoTargetSelector(result, text);
  }

  return result;
}

function findTextRepoUrl(ea: ElucidateAnnotation) {
  if (Array.isArray(ea.target)) {
    return (ea.target as Target[]).find(t => isString(t)) as string;
  } else if (isString(ea.target)) {
    return ea.target as string;
  } else {
    throw new Error('No target url');
  }
}

function getEntityType(ea: ElucidateAnnotation): string {
  const b = ea.body as EntityBody;

  const isClassifying = (body: any) => {
    return ['classifying', 'tagging'].includes(body.purpose);
  };

  const entityType = Array.isArray(b)
    ? b.find(isClassifying)?.value
    : isClassifying(b) ? b.value : undefined;

  if (!entityType) {
    console.warn('No classifying TextualBody found in ' + JSON.stringify(b));
    return 'recogito_entity_type';
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

function fromTrSelectorToCoordinates(targets: Target[]): number[] {
  const trSelectorTarget = targets.find((t: any) => t.selector?.start) as SelectorTarget;
  if(!trSelectorTarget) {
    throw new Error('No tr selector found in ' + JSON.stringify(targets));
  }
  return [trSelectorTarget.selector.start, 0, trSelectorTarget.selector.end + 1, 0];
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
function createRecogitoTargetSelector(a: MicroAnnotation, text: string[]) {
  const target = a.target as any as RecogitoTarget;
  let recogitoTarget = (a.target as RecogitoTarget[]).find(t => t.selector && Array.isArray(t.selector));

  if (!recogitoTarget) {
    recogitoTarget = {selector:[]} as RecogitoTarget;
    (a.target as Target[]).push(recogitoTarget);
    const newSelector = toRecogitoSelector(a.coordinates, text);
    recogitoTarget.selector.push(newSelector);
  }

  target.selector = recogitoTarget.selector;
}

function toRecogitoSelector(c: number[], lines: string[]): RecogitoPositionSelector {
  const lineCount = toLineCount(lines);

  const start = c[0] !== 0
    ? lineCount[c[0] - 1] + c[1]
    : c[1];

  let end;
  if (c[0] === c[2]) {
    end = start + c[3] + 1;
  } else {
    end = c[2] !== 0
      ? lineCount[c[2] - 1] + c[3] + 1
      : c[3] + 1;
  }

  return {
    type: 'TextPositionSelector',
    start,
    end
  };
}
