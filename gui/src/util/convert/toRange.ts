import {Annotation} from '../../model/Annotation';
import {AnnRange} from '../../model/AnnRange';

export default function toRange(ann: Annotation): AnnRange {
  const result = {} as AnnRange;
  result.beginAnchor = ann.coordinates[0];
  result.beginOffset = ann.coordinates[1];
  result.endAnchor = ann.coordinates[2];
  result.endOffset = ann.coordinates[3];
  return result;
}
