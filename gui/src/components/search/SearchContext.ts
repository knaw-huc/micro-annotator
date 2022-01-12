import {createContext, useContext} from 'react';
import {dummyProvider} from '../../util/dummyProvider';
import {MicroAnnotation} from '../../model/Annotation';

/**
 * Searched annotation and related fields
 */
export const useSearchContext = () => useContext(SearchContext);

export type SearchingStateType = {

  /**
   * Body ID of annotation linking to current text
   */
  annotationId: string,

  /**
   * Requestion annotation resources from elucidate and textrepo
   */
  searching: boolean

}

export type SearchStateType = SearchingStateType & {

  /**
   * Version ID, also used as elucidate collection ID
   */
  versionId: string,

  /**
   * Array of lines: text that can be annotated
   */
  annotatableText: string[],

  /**
   * Scan urls including image regions
   */
  imageRegions: string[],

  /**
   * Target ID of annotation linking to current text
   */
  targetId: string,

  /**
   * Line range of current text
   */
  beginRange: number,
  endRange: number,

  /**
   * Annotations that overlap with current annotation
   */
  overlappingAnnotations: MicroAnnotation[]

  /**
   * Annotations created by user in micro-annotator
   */
  userAnnotations: MicroAnnotation[]

};

export const defaultSearchContext = {
  state: {
    annotationId: '',
    versionId: '',
    annotatableText: [],
    imageRegions: [],
    targetId: '',
    beginRange: 0,
    endRange: 0,
    overlappingAnnotations: [],
    userAnnotations: [],
    searching: true
  },
  setState: dummyProvider
} as {
  state: SearchStateType;
  setState: (a: SearchingStateType | SearchStateType) => void
};

export const SearchContext = createContext(defaultSearchContext);

/**
 * When searching: only annotationId is available
 * When not searching: all annotation and associated fields should be present
 */
export const searchReducer = (
  state: SearchStateType,
  action: SearchingStateType | SearchStateType
): SearchStateType => {
  const searching = action.searching;
  if (searching) {
    const annotationId = action.annotationId;
    return Object.assign(
      {},
      defaultSearchContext.state,
      {searching, annotationId},
    );
  } else {
    return action as SearchStateType;
  }
};

