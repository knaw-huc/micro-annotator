import {AnnRange} from '../../model/AnnRange';
import {useEffect, useRef} from 'react';
import {Annotation} from '../../model/Annotation';
import HighlightLine from './HighlightLine';
import TextLine from './TextLine';
import toRange from '../../util/convert/toRange';

type AnnotatableTextProps = {
  text: string[],
  onReadSelection: (range: AnnRange) => void,
  selected: Annotation | undefined
};

export default function AnnotatableText(props: AnnotatableTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onReadSelection = props.onReadSelection;

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

    document.addEventListener('selectionchange', handleChange);
    return () => document.removeEventListener('selectionchange', handleChange);
  });

  return (
    <div className="text-container">
      <div className="text-box text-lines" ref={ref}>
        {props.text.map((line, index) => (
          <TextLine key={index} index={index} text={line}/>
        ))}
      </div>
      <div className="text-box text-underlay">
        {props.text.map((line, index) => {
          const lineRange = props.selected ? toLineRange(toRange(props.selected), index, line) : [0, 0];
          return (
            <HighlightLine
              key={index}
              index={index}
              text={line}
              selected={lineRange}
            />
          );
        })}
      </div>
    </div>
  );
}

function toLineRange(annRange: AnnRange, index: number, line: string): number[] {
  const result = [0, 0];
  if (index < annRange.beginAnchor || index > annRange.endAnchor) {
    // When line not selected:
    return result;
  }

  if (index === annRange.beginAnchor) {
    // When selection starts in line:
    result[0] = annRange.beginOffset;
  } else {
    // When selection starts before line:
    result[0] = 0;
  }

  if (index === annRange.endAnchor) {
    // When selection ends in line:
    result[1] = annRange.endOffset;
  } else {
    // When selection starts after line:
    result[1] = line.length - 1;
  }
  return result;
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
