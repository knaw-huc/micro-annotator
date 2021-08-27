const Image = ({ url, width }) => {	
	return (
		<div style={{ 'padding': '3px' }}>
			<img 
				src={url}
				width={width}
			/>
		</div>
	)
}

export default Image