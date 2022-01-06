import {useErrorContext} from './ErrorContext';

export default function ErrorMsg() {
  const {errorState} = useErrorContext();

  return <p
    className="error-msg"
  >
    Error: {errorState.message}
  </p>;
}
