type ErrorProps = {
  msg: string
}
export default function ErrorMsg(props: ErrorProps) {
  return <p
    className="error-msg"
  >
    Error: {props.msg}
  </p>
}
