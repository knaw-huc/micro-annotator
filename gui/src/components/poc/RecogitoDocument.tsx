import {useEffect, useRef, useState} from "react";
import {Recogito} from "@recogito/recogito-js";
import "@recogito/recogito-js/dist/recogito.min.css";
import {Annotation} from "../../model/Annotation";
import isString from "../../util/isString";

const VOCABULARY = [
  {label: "material", uri: "http://vocab.getty.edu/aat/300010358"},
  {label: "object", uri: "http://vocab.getty.edu/aat/300311889"},
  {label: "person", uri: "http://vocab.getty.edu/aat/300024979"},
];

interface DocumentProps {
  onAddAnnotation: (ann: any) => void;
  annotations: {}[];
  text: string;
  creator: string;
}

export default function RecogitoDocument(props: DocumentProps) {

  const [docRef] = useState(useRef<HTMLDivElement>(null));
  const annotations = props.annotations;

  let text = props.text;
  let onAddAnnotation = props.onAddAnnotation;
  useEffect(() => {
    console.log('rerender recogito');
    if (!docRef.current) {
      return;
    }
    docRef.current.textContent = text;

    const r = new Recogito({
      content: docRef.current,
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

    annotations.forEach((annotation: {}) => r.addAnnotation(annotation));

    r.on("createAnnotation", (a: any) => {
      const toSave = convertToUntanngleAnn(a, props.creator, text);
      onAddAnnotation(toSave);
    });

  }, [annotations, docRef, text, onAddAnnotation, props.creator]);

  return <div className="recogito-doc" ref={docRef}>lala</div>;

}

export function convertToRecogitoAnn(a: any, text: string[]): Annotation {
  if (isString(a.target)) {
    const source = a.target;
    a.target = {}
    a.target.source = source;
  } else {
    a.target = {}
  }
  a.target.selector = convertToRecogitoSelector(a, text)
  return a;
}

function convertToRecogitoSelector(a: Annotation, lines: string[]) {
  const lineCount = toLineCount(lines);
  const start = a.begin_anchor > 0
    ? lineCount[a.begin_anchor - 1] + a.begin_char_offset
    : a.begin_char_offset;

  let end = a.end_anchor > 0
    ? lineCount[a.end_anchor - 1] + a.end_char_offset + 1
    : a.end_char_offset + 1
  if (a.end_anchor === a.begin_anchor) {
    end = start - a.begin_char_offset + 1
  }

  return [{
    type: "TextPositionSelector",
    start,
    end
  }];
}

function convertToUntanngleAnn(a: any, creator: string, text: string) {
  const toSave = {} as Annotation;
  toSave.entity_comment = a.body.find((b: any) => b.purpose === 'commenting').value;
  toSave.entity_type = a.body.find((b: any) => b.purpose === 'tagging').value;
  toSave.creator = creator;
  const c = convertToUntanngleCoordinates(a, text);
  toSave.begin_anchor = c[0];
  toSave.begin_char_offset = c[1];
  toSave.end_anchor = c[2];
  toSave.end_char_offset = c[3];
  return toSave;
}

function convertToUntanngleCoordinates(a: any, text: string) {
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
