import {memo} from 'react';

type RecogitoRootProps = {
  id: string
  className: string
}

function alwaysMemo() {
  return () => true;
}

/**
 * Create a single, persistent dom node for all recogito instances
 */
export const AnnotatorRoot = memo((props: RecogitoRootProps) => {
  return <div id={props.id} className={props.className}/>;
}, alwaysMemo());
