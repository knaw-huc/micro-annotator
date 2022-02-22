import {Annotation, ENTITY_CONTEXT} from '../../model/Annotation';
import Config from '../../Config';
import {ElucidateAnnotation} from '../../model/ElucidateAnnotation';
import {toElucidateId} from './toElucidateId';

export function toDelElucidateAnn(a: ElucidateAnnotation & Annotation, versionId: string, currentCreator: string) {
  const toDel = a;
  toDel['@context'] = ENTITY_CONTEXT;
  toDel.id = toElucidateId(Config.ELUCIDATE_HOST, versionId, a.id);
  toDel.creator = currentCreator;
  toDel.body = a.body;
  return toDel;
}

