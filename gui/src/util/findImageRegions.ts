import {ElucidateTargetType} from '../model/ElucidateAnnotation';

export default function findImageRegions(target: ElucidateTargetType[]) {
  return target
    .filter(t => !t.selector && t.type === 'Image')
    .map(t => t.source);
}
