import {ElucidateAnnotation} from "../../model/ElucidateAnnotation";
import Config from "../../Config";
import {Annotation, ENTITY_CONTEXT} from "../../model/Annotation";
import {toElucidateId} from "./toElucidateId";

export function toUpdatableElucidateAnn(a: ElucidateAnnotation & Annotation, versionId: string, currentCreator: string) {
  const toUpdate = a.webAnn;
  toUpdate['@context'] = ENTITY_CONTEXT;
  toUpdate.id = toElucidateId(Config.ELUCIDATE_HOST, versionId, a.id);
  toUpdate.creator = currentCreator;
  toUpdate.body = a.body;
  return toUpdate;
}

