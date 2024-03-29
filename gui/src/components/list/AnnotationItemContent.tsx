import {Annotation} from '../../model/Annotation';
import ReactLinkify from 'react-linkify';
import toRange from '../../util/convert/toRange';
import {toRangeStr} from '../../util/convert/toRangeStr';
import {useState} from 'react';

type AnnotationContentProps = {
  ann: Annotation | undefined
}

export default function AnnotationItemContent(props: AnnotationContentProps): JSX.Element {
  const ann = props.ann;
  const [showFull, setShowFull] = useState(false);
  

  return <>{ann && <div className="annotation-content">
      <ul>
          <li>id: <br/><code>{ann.id}</code></li>
          <li>type: <br/><code>{ann.label} {ann.entity_type ? '(' + ann.entity_type + ')' : ''}</code></li>
          <li>comment: <br/><code>{ann.entity_comment}</code></li>
          <li>coordinates: <br/><code>{toRangeStr(toRange(ann))}</code></li>
          <li>creator: <br/><code>{ann.creator}</code></li>
          <li>
              <button className="show-full" onClick={(e) => {
                e.stopPropagation();
                setShowFull(!showFull);
              }}>full annotation {String.fromCharCode(showFull ? 9663 : 9657)}
              </button>
              <br/>
            {showFull && <pre className="annotation-preview">
              <ReactLinkify
                // Set target=blank using decorator
                // source: https://github.com/tasti/react-linkify/issues/96
                  componentDecorator={(decoratedHref, decoratedText, key) => (
                    <a target="blank" href={decoratedHref} key={key}>
                      {decoratedText}
                    </a>
                  )}
              >
                {JSON.stringify(ann.webAnn, null, 2)}
              </ReactLinkify>
          </pre>}
          </li>
      </ul>
  </div>}</>;
};

