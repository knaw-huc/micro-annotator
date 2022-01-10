import {AnnotationTypeStateType, useAnnotationTypeContext} from './AnnotationTypeContext';
import {AnnotationListType} from '../list/AnnotationList';

export default function AnnotationTypeField() {
  const annotationTypeState = useAnnotationTypeContext().state;
  const setAnnotationTypeState = useAnnotationTypeContext().setState;

  const changeToUser = () => setAnnotationTypeState({annotationType: AnnotationListType.USER});
  const changeToOverlap = () => setAnnotationTypeState({annotationType: AnnotationListType.OVERLAPPING});

  return <div className="tabs clearfix">
    <button
      className={'btn btn-block btn-tab' + selectedWhen(annotationTypeState, AnnotationListType.USER)}
      onClick={changeToUser}
    >
      By user ✍️
    </button>
    <button
      className={'btn btn-block btn-tab' + selectedWhen(annotationTypeState, AnnotationListType.OVERLAPPING)}
      onClick={changeToOverlap}
    >
      Overlap 🔒
    </button>
  </div>;
}

function selectedWhen(annotationTypeState: AnnotationTypeStateType, when: AnnotationListType) {
  return annotationTypeState.annotationType === when ? ' btn-tab-selected' : ' btn-tab-deselected';
}
