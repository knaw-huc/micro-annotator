import {createContext, useContext} from 'react';
import {AnnotationListType} from '../list/AnnotationList';
import {baseReducer} from '../../util/baseReducer';
import {ContextType} from '../common/ContextType';
import {dummyProvider} from '../../util/dummyProvider';

/**
 * What type of annotations to display in annotation list?
 */
export const useAnnotationTypeContext = () => useContext(AnnotationTypeContext);
export type AnnotationTypeStateType = {
  annotationType: string;
}

export const defaultAnnotationTypeContext = {
  state: {
    annotationType: AnnotationListType.USER
  },
  setState: dummyProvider
} as ContextType<AnnotationTypeStateType>;

export const AnnotationTypeContext = createContext(defaultAnnotationTypeContext);
export const annotationTypeReducer : (<T extends AnnotationTypeStateType>(s: T, a: T) => T) = baseReducer;

