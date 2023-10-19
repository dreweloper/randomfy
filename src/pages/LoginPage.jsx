import { useAuth } from '../hooks';
import { STATUS } from '../utils';

export const LoginPage = () => {

  // CUSTOM HOOK
  const { status, requestUserAuth } = useAuth();


  return (

    <>

      <h1>Randomfy</h1>

      <button onClick={requestUserAuth}>Login</button>

      {
        status === STATUS.LOADING && <p>Loading…</p>
      }

      {
        status === STATUS.FAILED && <p>Access denied!</p>
      }

    </>

  );

};