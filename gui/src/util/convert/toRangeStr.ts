import {AnnRange} from '../../model/AnnRange';

export function toRangeStr(range: AnnRange | undefined) {
  if (range === undefined) {
    return '';
  }
  return '('
    + range.beginAnchor + ','
    + range.beginOffset + ')('
    + range.endAnchor + ','
    + range.endOffset + ')';
}

