import React, {MutableRefObject} from "react";

type TextContainerProps = {
  svgRef: MutableRefObject<any>
};

function areEqual(): boolean {
  return true;
}

export const TextContainer = React.memo<TextContainerProps>((props) => {
  return <pre ref={props.svgRef}/>;
}, areEqual);


