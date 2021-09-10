import {useState} from 'react';

type TextLineProps = {
    index: number,
    text: string
}

export default function TextLine(props: TextLineProps) {
    const [anchorIsShown, setAnchorIsShown] = useState(false);

    return (
        <div
            id={'' + props.index}
            onMouseEnter={() => setAnchorIsShown(true)}
            onMouseLeave={() => setAnchorIsShown(false)}
            style={{'fontSize': '9px'}}
            className={anchorIsShown ? 'anchor' : ''}>
            {props.text}
        </div>
    )
}
