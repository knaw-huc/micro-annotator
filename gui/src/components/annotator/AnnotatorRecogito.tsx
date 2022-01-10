import '@recogito/recogito-js/dist/recogito.min.css';
import {memo, useEffect, useState} from 'react';
import {AnnotatorRoot} from './AnnotatorRoot';
import {MicroAnnotation} from '../../model/Annotation';
import {Recogito} from '@recogito/recogito-js';

const VOCABULARY = [
  {label: 'place', uri: 'https://dbpedia.org/property/place'},
  {label: 'organisation', uri: 'https://dbpedia.org/property/organisation'},
  {label: 'person', uri: 'https://dbpedia.org/property/person'},
];

interface RecogitoDocumentProps {
  onAddAnnotation: (ann: any) => void,
  onUpdateAnnotation: (ann: any) => void,
  annotations: MicroAnnotation[],
  text: string,
  creator: string,
  readOnly: boolean,
}

export const AnnotatorRecogito = memo((props: RecogitoDocumentProps) => {

  const [toAdd, setToAdd] = useState<MicroAnnotation | undefined>();
  const [toUpdate, setToUpdate] = useState<MicroAnnotation | undefined>();

  const rootName = 'recogito-root';

  /**
   * useEffect uses up-to-date event handler:
   */
  useEffect(() => {
    if (toAdd) {
      delete (toAdd as any).id;
      props.onAddAnnotation(toAdd);
      setToAdd(undefined);
    }
  }, [props, toAdd]);

  /**
   * useEffect uses up-to-date event handler:
   */
  useEffect(() => {
    if (toUpdate) {
      props.onUpdateAnnotation(toUpdate);
      setToUpdate(undefined);
    }
  }, [props, toUpdate]);

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
      setToAdd(a);
    });

    r.on('updateAnnotation', (a: any) => {
      setToUpdate(a);
    });

    return () => {
      r.destroy();
    };

  }, [props, props.annotations]);

  return <AnnotatorRoot id={rootName} className="recogito-doc"/>;
}, (prev, next) => {
  return prev.text === next.text
    && prev.annotations.map(a => a.id).join(',') === next.annotations.map(a => a.id).join(',');
});

