import Image from './Image'

const ImageParts = ({images}) => {
    return (
        <div style={{'maxHeight': '500px'}}>
            {images.map((url, index) => (
                <Image key={index} url={url} width='220'/>
            ))}
        </div>
    )
}

export default ImageParts
