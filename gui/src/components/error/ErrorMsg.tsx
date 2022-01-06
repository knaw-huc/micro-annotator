import {useErrorContext} from './ErrorContext';

export default function ErrorMsg() {
  const {state} = useErrorContext();

  return <>{state.message && <p
      className="error-msg"
  >
      Error: {state.message}
  </p>}</>;
}
