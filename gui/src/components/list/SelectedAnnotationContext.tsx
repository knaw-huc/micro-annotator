import {createContext, useContext} from 'react';
import {baseReducer} from '../../util/baseReducer';
import {ContextType} from '../common/ContextType';
import {dummyProvider} from '../../util/dummyProvider';
import {MicroAnnotation} from '../../model/Annotation';

/**
 * Selected annotation in annotation list, or undefined when no annotation
 */
export const useSelectedAnnotationContext = () => useContext(SelectedAnnotationContext);
export type SelectedAnnotationStateType = {
  selected: MicroAnnotation | undefined;
}

export const defaultSelectedAnnotationContext = {
  state: {
    selected: undefined
  },
  setState: dummyProvider
} as ContextType<SelectedAnnotationStateType>;

export const SelectedAnnotationContext = createContext(defaultSelectedAnnotationContext);
export const selectedAnnotationReducer : (<T extends SelectedAnnotationStateType>(s: T, a: T) => T) = baseReducer;

