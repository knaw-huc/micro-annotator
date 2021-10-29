import {ChangeEvent} from "react";

type CreatorFieldType = {
    creator: string,
    onChange: (creator: string) => void
}

export function CreatorField(props: CreatorFieldType) {
    return (
        <div className='form-control'>
            <label>Creator</label>
            <input value={props.creator}
                   onChange={(e: ChangeEvent<HTMLInputElement>) => props.onChange(e.target.value)}/>
        </div>
    )
}