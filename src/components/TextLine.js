import {useState} from 'react';

export default function TextLine({text, id}) {
    const [anchorIsShown, setAnchorIsShown] = useState(false);

    return (
        <div
            id={id}
            onMouseEnter={() => setAnchorIsShown(true)}
            onMouseLeave={() => setAnchorIsShown(false)}
            style={{'fontSize': '9px'}}
            className={anchorIsShown ? 'anchor' : ''}>
            {text}
        </div>
    )
}
