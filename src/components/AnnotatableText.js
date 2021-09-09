import {useEffect, useRef} from 'react'

import TextLine from './TextLine'

const AnnotatableText = ({text, onReadSelection}) => {
    const ref = useRef();

    useEffect(() => {
        function handleChange() {
            // get selection information from the browser
            const selection = window.getSelection();

            // we only want to proceed when we have a valid selection
            if (
                !selection ||
                selection.isCollapsed ||
                !selection.containsNode(ref.current, true)
            ) {
                return;
            }

            onReadSelection();
        }

        document.addEventListener("selectionchange", handleChange);
        return () => document.removeEventListener("selectionchange", handleChange);
    }, [onReadSelection]);

    return (
        <div ref={ref} style={{'padding': '5px', 'lineHeight': '76%'}}>
            {text.map((line, index) => (
                <TextLine key={index} id={index} text={line} width/>
            ))}
        </div>
    )
}

export default AnnotatableText
