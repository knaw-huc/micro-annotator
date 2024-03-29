import {ElucidateAnnotation, SelectorTarget} from '../model/ElucidateAnnotation';

export default function findSelectorTarget(foundAnn: ElucidateAnnotation) {
  return (foundAnn.target as SelectorTarget[])
    .find((t: SelectorTarget) => [undefined, 'Text'].includes(t.type)) as SelectorTarget;
}