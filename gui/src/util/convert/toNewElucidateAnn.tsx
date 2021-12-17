import {ENTITY_CONTEXT, MicroAnnotation} from "../../model/Annotation";
import {RecogitoTargetType} from "../../model/ElucidateAnnotation";
import Config from "../../Config";
import {toLineCount} from "./toLineCount";

export function toNewElucidateAnn(
  a: MicroAnnotation,
  creator: string,
  text: string[],
  begin: number,
  versionId: string
) {
  a['@context'] = ENTITY_CONTEXT;
  a.type = ["Annotation", "Entity"];
  a.creator = creator;

  let c = toUntanngleCoordinates(a, text.join("\n"));
  c = toAbsoluteOffsets(c, begin);
  const target = a.target as RecogitoTargetType;
  a.target = [];
  a.target.push(target);
  a.target.push(`${Config.TEXTREPO_HOST}/view/versions/${versionId}/segments/index/${c[0]}/${c[1]}/${c[2]}/${c[3]}`);
  a.target.push({
    type: "urn:example:republic:TextAnchorSelector",
    "start": c[0],
    "end": c[2]
  } as any);
  return a;
}

function toUntanngleCoordinates(a: any, text: string) {
  const position = a.target.selector.find((t: any) => t.type === 'TextPositionSelector');
  const start = position.start;
  const end = position.end;
  const lines = text.split('\n');
  const lineCount = toLineCount(lines);
  const startAnchor = lineCount.findIndex(lc => lc > start);
  const endAnchor = lineCount.findIndex(lc => lc > end);
  const startChar = startAnchor > 0
    ? start - lineCount[startAnchor - 1]
    : start;
  let endChar = endAnchor > 0
    ? end - lineCount[endAnchor - 1] - 1
    : end - 1;
  if (endAnchor === startAnchor) {
    endChar = endChar - startChar
  }
  return [startAnchor, startChar, endAnchor, endChar];
}

/**
 * Absolute, starting at beginning of corpus
 */
function toAbsoluteOffsets(c: number[], offset: number) {
  c[0] += offset;
  c[2] += offset;
  return c;
}

