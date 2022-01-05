import {ElucidateAnnotation, ElucidateBody} from '../model/ElucidateAnnotation';

export function findBodyId(a: ElucidateAnnotation): string {
  if (Array.isArray(a.body)) {
    const body = (a.body as ElucidateBody[]).find(b => b.id);
    if(body) {
      return body.id;
    } else {
      throw new Error('No body id found in ' + JSON.stringify(a));
    }
  } else {
    return (a.body as ElucidateBody).id;
  }
}

