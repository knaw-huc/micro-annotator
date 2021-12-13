import {useEffect} from "react";
import {Recogito} from "@recogito/recogito-js";
import "@recogito/recogito-js/dist/recogito.min.css";
import {Annotation, MicroAnnotation, toMicroAnn, toRelativeOffsets} from "../../model/Annotation";
import isString from "../../util/isString";
import {
  BodyType,
  CommentingBodyType,
  ElucidateAnnotation,
  ElucidateTargetType,
  RecogitoCreator,
  Selector,
  SelectorTarget
} from "../../model/ElucidateAnnotation";
import {RecogitoRoot} from "./RecogitoRoot";

const VOCABULARY = [
  {label: "material", uri: "http://vocab.getty.edu/aat/300010358"},
  {label: "object", uri: "http://vocab.getty.edu/aat/300311889"},
  {label: "person", uri: "http://vocab.getty.edu/aat/300024979"},
];

interface RecogitoDocumentProps {
  onAddAnnotation: (ann: any) => void;
  annotations: {}[];
  text: string;
  creator: string;
  readOnly: boolean;
}

export const RecogitoDocument = (props: RecogitoDocumentProps) => {
  console.log('render MinimalRecogito');
  const rootName = 'recogito-root-minimal';

  useEffect(() => {
    let elementById = document.getElementById(rootName);
    if(elementById) {
      elementById.textContent = props.text;
    }
    const r = new Recogito({
      content: rootName,
      locale: "auto",
      mode: "pre",
      widgets: [
        {widget: "COMMENT"},
        {
          widget: "TAG",
          vocabulary: VOCABULARY,
        },
      ],
      relationVocabulary: ["isRelated", "isPartOf", "isSameAs "],
      readOnly: props.readOnly,
      formatter: (annotation: any) => {
        const tags = annotation.bodies.flatMap((body: any) =>
          body && body.purpose === "tagging" ? body.value : []
        );

        const tagClasses: string[] = [];

        for (const tag of tags) {
          if (tag === "material") {
            tagClasses.push("tag-material");
          } else if (tag === "object") {
            tagClasses.push("tag-object");
          } else if (tag === "person") {
            tagClasses.push("tag-person");
          }
        }
        return tagClasses.join(" ");
      },
    });

    for (const annotation of props.annotations) {
      r.addAnnotation(annotation)
    }
    r.on("createAnnotation", (a: any) => {
      const toSave = toUntanngleAnn(a, props.creator, props.text);
      props.onAddAnnotation(toSave);
    });

    return () => {
      r.destroy()
    }
  }, [props])

  return <RecogitoRoot id={rootName}/>

}

export function toRecogitoAnn(a: ElucidateAnnotation, text: string[], beginRange: number): MicroAnnotation {
  let result = toMicroAnn(a);
  result = toRelativeOffsets(result, beginRange) as MicroAnnotation
  if (isString(a.target)) {
    const source = a.target as string;
    result.target = {} as ElucidateTargetType;
    result.target.source = source;
  }
  const target = result.target as SelectorTarget;
  target.selector = toRecogitoSelector(result, text)
  if (Array.isArray(result.body)) {
    const body = result.body as BodyType[];
    body
      .filter((b: BodyType) => b.purpose === "commenting")
      .forEach((b: BodyType) => (b as CommentingBodyType).creator = toRecogitoCreator(result.creator));
    body
      .filter((b: BodyType) => b.purpose === "classifying")
      .forEach((b: BodyType) => b.purpose = "tagging");
  }
  return result;
}

function toRecogitoCreator(creator: string): RecogitoCreator {
  return {
    id: creator,
    name: creator
  };
}

function toRecogitoSelector(a: MicroAnnotation, lines: string[]): Selector {
  const lineCount = toLineCount(lines);

  const start = a.begin_anchor
    ? lineCount[a.begin_anchor - 1] + a.begin_char_offset
    : a.begin_char_offset;

  let end;
  if (a.begin_anchor === a.end_anchor) {
    end = start + a.end_char_offset + 1;
  } else {
    end = a.end_anchor
      ? lineCount[a.end_anchor - 1] + a.end_char_offset + 1
      : a.end_char_offset + 1
  }

  return {
    type: "TextPositionSelector",
    start,
    end
  };
}

function toUntanngleAnn(a: any, creator: string, text: string) {
  const toSave = {} as Annotation;
  toSave.entity_comment = a.body.find((b: any) => b.purpose === 'commenting').value;
  toSave.entity_type = a.body.find((b: any) => b.purpose === 'tagging').value;
  toSave.creator = creator;
  const c = toUntanngleCoordinates(a, text);
  toSave.begin_anchor = c[0];
  toSave.begin_char_offset = c[1];
  toSave.end_anchor = c[2];
  toSave.end_char_offset = c[3];
  return toSave;
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

function toLineCount(lines: string[]) {
  const lineEnd = 1;
  let charCount = 0;
  return lines.map(l => charCount += l.length + lineEnd);
}
