import {ChangeEvent} from 'react';
import {useCreatorContext} from './CreatorContext';

export function Creator() {

  const {creatorState, setCreatorState} = useCreatorContext();

  return (
    <div className='form-control'>
      <label>Creator</label>
      <input
        value={creatorState.creator}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setCreatorState({creator: e.target.value})}
      />
    </div>
  );
}
