import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks';
import { STATUS } from '../utils';

export const LoginPage = () => {

  // REACT-ROUTER-DOM HOOK
  const [searchParams, setSearchParams] = useSearchParams();

  // CUSTOM HOOK
  const { status, handleUserAuthResponse, requestUserAuth } = useAuth();

  // REACT HOOK
  useEffect(() => {
    
    /**
     * Search params are not empty. It indicates that the user has clicked the login button.
     * Once the user accepts or denied the requested permissions, the OAuth service redirects the user back to the URL specified in the 'redirect_uri' field ('/login').
     */
    if (searchParams.size > 0) handleUserAuthResponse(searchParams);

    return () => {

      // Clear the URL search params if they are not empty.
      if (searchParams.size > 0) setSearchParams();

    };

  }, [searchParams]);


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