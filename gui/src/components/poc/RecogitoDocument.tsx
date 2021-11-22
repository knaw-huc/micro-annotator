import {MutableRefObject, useEffect} from "react";
import {Recogito} from "@recogito/recogito-js";
import "@recogito/recogito-js/dist/recogito.min.css";
import {Annotation} from "../../model/Annotation";

const VOCABULARY = [
  {label: "material", uri: "http://vocab.getty.edu/aat/300010358"},
  {label: "object", uri: "http://vocab.getty.edu/aat/300311889"},
  {label: "person", uri: "http://vocab.getty.edu/aat/300024979"},
];

interface DocumentProps {
  onAddAnnotation: (ann: Annotation) => void;
  annotations: {}[];
  docRef: MutableRefObject<any>;
  text: string
}

export default function RecogitoDocument(props: DocumentProps) {

  const docRef = props.docRef;
  const onAddAnnotation = props.onAddAnnotation;
  const annotations = props.annotations;
  const text = props.text;

  useEffect(() => {
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
          body.purpose === "tagging" ? body.value : []
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

    r.on("createAnnotation", onAddAnnotation);

  }, [docRef, annotations, onAddAnnotation, text]);

  return null;
}
