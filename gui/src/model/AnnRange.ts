import {Annotation} from "./Annotation";

export type AnnRange = {
  beginAnchor: number;
  beginOffset: number;
  endAnchor: number;
  endOffset: number;
}

export function toRange(ann: Annotation): AnnRange {
  const result = {} as AnnRange;
  result.beginAnchor = ann.begin_anchor;
  result.beginOffset = ann.begin_char_offset;
  result.endAnchor = ann.end_anchor;
  result.endOffset = ann.end_char_offset;
  return result;
}
