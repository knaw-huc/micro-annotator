import Image from './Image'

type ImagePartsProps = {
  images: string[]
}

export default function ImageParts(props: ImagePartsProps) {
  return (
    <div style={{'maxHeight': '500px'}}>
      {props.images.map((img, index) => (
        <Image key={index} url={img} width={220}/>
      ))}
    </div>
  )
}
