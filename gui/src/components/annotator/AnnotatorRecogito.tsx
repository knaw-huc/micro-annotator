import '@recogito/recogito-js/dist/recogito.min.css';
import {useEffect, useState} from 'react';
import {AnnotatorRoot} from './AnnotatorRoot';
import {MicroAnnotation} from '../../model/Annotation';
import {Recogito} from '@recogito/recogito-js';
import {usePrevious} from '../../util/usePrevious';

const VOCABULARY = [
  {label: 'place', uri: 'https://dbpedia.org/property/place'},
  {label: 'organisation', uri: 'https://dbpedia.org/property/organisation'},
  {label: 'person', uri: 'https://dbpedia.org/property/person'}
];

interface AnnotatorRecogitoProps {
  onAddAnnotation: (ann: any) => void,
  onUpdateAnnotation: (ann: any) => void,
  annotations: MicroAnnotation[],
  text: string,
  creator: string,
  readOnly: boolean,
}

function toIds(annotations: MicroAnnotation[]) {
  return annotations.map(a => a.id).join(',');
}

export const AnnotatorRecogito = (props: AnnotatorRecogitoProps) => {

  const rootName = 'recogito-root';
  const [toAdd, setToAdd] = useState<MicroAnnotation | undefined>();
  const [toUpdate, setToUpdate] = useState<MicroAnnotation | undefined>();
  const prevText = usePrevious(props.text);
  const prevAnnotationIds = usePrevious(props.text);

  /**
   * Add annotation
   * with up-to-date event handler
   */
  useEffect(() => {
    if (toAdd) {
      delete (toAdd as any).id;
      props.onAddAnnotation(toAdd);
      setToAdd(undefined);
    }
  }, [props, toAdd]);

  /**
   * Update annotation
   * with up-to-date event handler
   */
  useEffect(() => {
    if (toUpdate) {
      props.onUpdateAnnotation(toUpdate);
      setToUpdate(undefined);
    }
  }, [props, toUpdate]);

  /**
   * Rerender recogito
   * when text or annotation change
   */
  useEffect(() => {

    const textEqual = props.text === prevText;
    const annotationsEqual = toIds(props.annotations) === prevAnnotationIds;
    if(textEqual && annotationsEqual) {
      return;
    }

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
          if (tag === 'place') {
            tagClasses.push('tag-place');
          } else if (tag === 'organisation') {
            tagClasses.push('tag-organisation');
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

  }, [props, prevText, prevAnnotationIds]);

  return <AnnotatorRoot id={rootName} className="recogito-doc"/>;
};

