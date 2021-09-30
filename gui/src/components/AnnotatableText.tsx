import {useEffect, useRef} from 'react'
import TextLine from "./TextLine";
import {AnnRange} from "../model/AnnRange";

type AnnotatableTextProps = {
  text: string[],
  onReadSelection: (range: AnnRange) => void
};

export default function AnnotatableText(props: AnnotatableTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onReadSelection = props.onReadSelection

  useEffect(() => {
    function handleChange() {
      const s: any = window.getSelection();

      // Range needs selection:
      if (!ref.current || !s || s.isCollapsed || !s.containsNode(ref.current, true)) {
        return;
      }

      // Range needs numbers for ids:
      const anchorId = s.anchorNode.parentNode?.id;
      const focusId = s.focusNode.parentNode?.id;
      if (!isInt(anchorId) || !isInt(focusId)) {
        return;
      }

      let anchorIdx = parseInt(anchorId);
      let focusIdx = parseInt(focusId);

      let anchorBeforeFocus = anchorIdx < focusIdx || (anchorIdx === focusIdx && s.anchorOffset < s.focusOffset);
      let singleLineSelection = anchorIdx === focusIdx;

      let result: AnnRange;
      if (anchorBeforeFocus) {
        result = {
          beginAnchor: anchorIdx,
          beginOffset: s.anchorOffset,
          endAnchor: focusIdx,
          endOffset: (singleLineSelection ? s.focusOffset - s.anchorOffset : s.focusOffset) - 1
        } as AnnRange;
      } else {
        result = {
          beginAnchor: focusIdx,
          beginOffset: s.focusOffset,
          endAnchor: anchorIdx,
          endOffset: (singleLineSelection ? s.anchorOffset - s.focusOffset : s.anchorOffset) - 1
        } as AnnRange;
      }

      onReadSelection(result);
    }

    document.addEventListener("selectionchange", handleChange);
    return () => document.removeEventListener("selectionchange", handleChange);
  });

  return (
    <div ref={ref} style={{'padding': '5px', 'lineHeight': '76%'}}>
      {props.text.map((line, index) => (
        <TextLine key={index} index={index} text={line}/>
      ))}
    </div>
  )
}

/**
 * Source: https://stackoverflow.com/a/14794066
 */
function isInt(value: any) {
  if (isNaN(value)) {
    return false;
  }
  var x = parseFloat(value);
  return (x | 0) === x;
}
