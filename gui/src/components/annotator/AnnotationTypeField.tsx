import {AnnotationListType} from '../list/AnnotationList';
import {useAnnotationTypeContext} from './AnnotationTypeContext';

export default function AnnotationTypeField() {
  const annotationTypeState = useAnnotationTypeContext().state;
  const setAnnotationTypeState = useAnnotationTypeContext().setState;

  const changeToUser = () => setAnnotationTypeState({annotationType: AnnotationListType.USER});
  const changeToRange = () => setAnnotationTypeState({annotationType: AnnotationListType.RANGE});

  return <div className="tabs clearfix">
    <button
      className={'btn btn-block btn-tab'
      + (annotationTypeState.annotationType === AnnotationListType.USER ? ' btn-tab-selected' : '')}
      onClick={changeToUser}
    >
      By user ✍️
    </button>
    <button
      className={'btn btn-block btn-tab'
      + (annotationTypeState.annotationType === AnnotationListType.RANGE ? ' btn-tab-selected' : '')}
      onClick={changeToRange}
    >
      Overlap 🔒
    </button>
  </div>;
}
