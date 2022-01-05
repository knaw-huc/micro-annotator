export type ImageProps = {
  url: string;
  width: number
}

export default function Image(props: ImageProps) {
  return (
    <div style={{'padding': '3px'}}>
      <img
        src={props.url}
        width={props.width}
        alt=""
      />
    </div>
  );
}
