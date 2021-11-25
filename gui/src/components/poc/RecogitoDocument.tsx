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

export function convertToRecogitoAnno(a: any, text: string[]): Annotation {
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
  const lineEnd = 1;
  let charCount = 0;
  const lineCount = lines.map(l => charCount += l.length + lineEnd);

  const start = lineCount[a.begin_anchor-1]+a.begin_char_offset;
  const end = a.begin_anchor === a.end_anchor
    ? start + a.end_char_offset + 1
    : lineCount[a.end_anchor-1] + a.end_char_offset + 1;
  // TODO: Fix `Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'purpose')`
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
  const lineEnd = 1;
  let charCount = 0;
  const lineCount = lines.map(l => charCount += l.length + lineEnd);
  const startAnchor = lineCount.findIndex(lc => lc > start) - 1;
  const startChar = start - lineCount[startAnchor];
  const endAnchor = lineCount.findIndex(lc => lc > end) - 1;
  const endChar = end - lineCount[endAnchor];
  return [startAnchor, startChar, endAnchor, endChar];
}
