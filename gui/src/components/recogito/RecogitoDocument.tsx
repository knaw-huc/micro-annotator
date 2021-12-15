import {useEffect} from "react";
import {Recogito} from "@recogito/recogito-js";
import "@recogito/recogito-js/dist/recogito.min.css";
import {MicroAnnotation, toMicroAnn, toRelativeOffsets} from "../../model/Annotation";
import {ElucidateAnnotation} from "../../model/ElucidateAnnotation";
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
  const rootName = 'recogito-root';

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
      delete a.id;
      props.onAddAnnotation(a);
    });

    return () => {
      r.destroy()
    }

  }, [props])

  return <RecogitoRoot id={rootName} className="recogito-doc" />
}

export function toRecogitoAnn(a: ElucidateAnnotation, beginRange: number): MicroAnnotation {
  let result = toMicroAnn(a);
  result.coordinates = toRelativeOffsets(result.coordinates, beginRange);

  // Recogito expects a.target.selector instead of a.target[*].selector:
  if(Array.isArray(a.target)) {
    (a.target as any).selector = (a.target as any[]).find(t => t.selector)?.selector;
  }

  return result;
}

export function toUntanngleCoordinates(a: any, text: string) {
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
