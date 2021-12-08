import {useEffect, useRef, useState} from "react";
import {Recogito} from "@recogito/recogito-js";
import "@recogito/recogito-js/dist/recogito.min.css";
import {Annotation, MicroAnnotation, toMicroAnn, toRelativeOffsets} from "../../model/Annotation";
import isString from "../../util/isString";
import {SelectorTarget} from "../../model/ElucidateAnnotation";

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
  const [recogito, setRecogito] = useState<Recogito>()

  const annotations = props.annotations;

  let text = props.text;
  let onAddAnnotation = props.onAddAnnotation;

  // Create recogito instance:
  useEffect(() => {
    if (!docRef.current || recogito) {
      return;
    }
    setRecogito(new Recogito({
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
    }));
  }, [docRef, recogito]);

  // Add text and annotations to recogito:
  useEffect(() => {
    if (!docRef.current || !recogito) {
      return;
    }

    docRef.current.textContent = text;

    recogito.clearAnnotations();

    annotations.forEach((annotation: any) => {
      recogito.addAnnotation(annotation)
    });

    recogito.on("createAnnotation", (a: any) => {
      const toSave = toUntanngleAnn(a, props.creator, text);
      onAddAnnotation(toSave);
    });

  }, [docRef, recogito, annotations, text, onAddAnnotation, props.creator]);

  return <div className="recogito-doc" ref={docRef}/>;
}

export function toRecogitoAnn(a: any, text: string[], beginRange: number): MicroAnnotation {
  let result = toMicroAnn(a);
  result = toRelativeOffsets(result, beginRange) as MicroAnnotation
  if (isString(a.target)) {
    const source = a.target;
    result.target = {} as SelectorTarget;
    result.target.source = source;
  }
  a.target.selector = toRecogitoSelector(a, text)
  a.body.map((b: any) => b.creator = toRecogitoCreator(a.creator));
  a.body.find((b: any) => b.purpose === 'classifying').purpose = 'tagging';
  return a;
}

function toRecogitoCreator(creator: string) {
  return {
    id: creator,
    name: creator
  };
}

function toRecogitoSelector(a: MicroAnnotation, lines: string[]) {
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

  return [{
    type: "TextPositionSelector",
    start,
    end
  }];
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
