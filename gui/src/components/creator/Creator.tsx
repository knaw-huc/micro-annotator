import {ChangeEvent} from 'react';
import {useCreatorContext} from './CreatorContext';

export function Creator() {

  const {state, setState} = useCreatorContext();

  return (
    <div className='form-control'>
      <label>Creator</label>
      <input
        value={state.creator}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setState({creator: e.target.value})}
      />
    </div>
  );
}
