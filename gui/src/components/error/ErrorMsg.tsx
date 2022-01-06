import {useErrorContext} from './ErrorContext';

export default function ErrorMsg() {
  const {errorState} = useErrorContext();

  return <>{errorState.message && <p
      className="error-msg"
  >
      Error: {errorState.message}
  </p>}</>;
}
