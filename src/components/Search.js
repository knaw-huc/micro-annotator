import { useState } from 'react'

const Search = ({ onSearch }) => {
	const [id, setID] = useState('')
	
	const onSubmit = (e) =>{
		e.preventDefault()
		
		if(!id) {
			alert('Please add an annotation identifier')
		}
		
		onSearch({ id })
		
		setID('')
	}
	
	return (
		<form className='add-form' onSubmit={onSubmit}>
			<div className='form-control'>
				<label>Annotation ID</label>
				<input 
					type='text' 
					placeholder='Please enter annotation id' value={id}
					onChange={
						(e) => setID(e.target.value)
					}
				/>
			</div>
			
			<input type='submit' value='Search' className='btn btn-block'/>
		</form>
	)
}

export default Search