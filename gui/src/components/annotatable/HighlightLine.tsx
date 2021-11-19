type TextLineProps = {
  index: number,
  text: string,
  selected: number[]
}

export default function HighlightLine(props: TextLineProps) {

  let text: JSX.Element;
  if (!props.selected[0] && !props.selected[1]) {
    text = <>{props.text}</>;
  } else {
    let start = props.text.slice(0, props.selected[0]);
    let selection = props.text.slice(props.selected[0], props.selected[0] + props.selected[1] + 1);
    let end = props.text.slice(props.selected[0] + props.selected[1], props.text.length + 1);
    text = <>
      {start}
      <span className="selected-text">{selection}</span>
      {end}
    </>
  }
  return (
    <>
      <div
        style={{'fontSize': '9px'}}
      >
        {text}
      </div>
    </>
  )
}
