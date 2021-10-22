import {Annotation} from "../model/Annotation";
import {toRangeStr} from "../util/toRangeStr";
import {toRange} from "../model/AnnRange";
import {useState} from "react";

type AnnotationContentProps = {
  ann: Annotation | undefined
}

export default function AnnotationContent(props: AnnotationContentProps) {
  const ann = props.ann;
  const [showFull, setShowFull] = useState(false);
  return ann
    ? <div className="annotation-content">
      <ul>
        <li>id: <br/><code>{ann.id}</code></li>
        <li>type: <br/><code>{ann.label} {ann.entity_type ? '(' + ann.entity_type + ')' : ''}</code></li>
        <li>comment: <br/><code>{ann.entity_comment}</code></li>
        <li>coordinates: <br/><code>{toRangeStr(toRange(ann))}</code></li>
        <li>creator: <br/><code>{ann.creator}</code></li>
        <li>
          <button className="show-full" onClick={(e) => {
            e.stopPropagation();
            setShowFull(!showFull)
          }}>full annotation {String.fromCharCode(showFull ? 9663 : 9657)}
          </button>
          <br/>
          {showFull ? <pre className="annotation-preview" >{JSON.stringify(ann.source, null, 2)}</pre> : null}
        </li>
      </ul>
    </div>
    : null;

};

