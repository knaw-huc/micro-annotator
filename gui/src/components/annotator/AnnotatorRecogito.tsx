import '@recogito/recogito-js/dist/recogito.min.css';
import {AnnotatorRoot} from './AnnotatorRoot';
import {Recogito} from '@recogito/recogito-js';
import {useEffect} from 'react';
import {MicroAnnotation} from '../../model/Annotation';

const VOCABULARY = [
  {label: 'place', uri: 'https://dbpedia.org/property/place'},
  {label: 'organisation', uri: 'https://dbpedia.org/property/organisation'},
  {label: 'person', uri: 'https://dbpedia.org/property/person'},
];

interface RecogitoDocumentProps {
  onAddAnnotation: (ann: any) => void;
  onUpdateAnnotation: (ann: any) => void;
  annotations: MicroAnnotation[];
  text: string;
  creator: string;
  readOnly: boolean;
}

export const AnnotatorRecogito = (props: RecogitoDocumentProps) => {

  const rootName = 'recogito-root';

  useEffect(() => {
    const elementById = document.getElementById(rootName);
    if (elementById) {
      elementById.textContent = props.text;
    }
    const r = new Recogito({
      content: rootName,
      locale: 'auto',
      mode: 'pre',
      widgets: [
        {widget: 'COMMENT'},
        {
          widget: 'TAG',
          vocabulary: VOCABULARY,
        },
      ],
      relationVocabulary: ['isRelated', 'isPartOf', 'isSameAs '],
      readOnly: props.readOnly,
      formatter: (annotation: any) => {
        const tags = annotation.bodies.flatMap((body: any) =>
          body && body.purpose === 'tagging' ? body.value : []
        );

        const tagClasses: string[] = [];

        for (const tag of tags) {
          if (tag === 'material') {
            tagClasses.push('tag-material');
          } else if (tag === 'object') {
            tagClasses.push('tag-object');
          } else if (tag === 'person') {
            tagClasses.push('tag-person');
          }
        }
        return tagClasses.join(' ');
      },
    });

    for (const annotation of props.annotations) {
      r.addAnnotation(annotation);
    }

    r.on('createAnnotation', (a: any) => {
      delete a.id;
      props.onAddAnnotation(a);
    });

    r.on('updateAnnotation', (a: any) => {
      props.onUpdateAnnotation(a);
    });

    return () => {
      r.destroy();
    };

  }, [props, props.annotations]);

  return <AnnotatorRoot id={rootName} className="recogito-doc"/>;
};

