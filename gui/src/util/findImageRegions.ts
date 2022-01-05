import {ElucidateTarget} from '../model/ElucidateAnnotation';

export default function findImageRegions(target: ElucidateTarget[]) {
  return target
    .filter(t => !t.selector && t.type === 'Image')
    .map(t => t.source);
}
