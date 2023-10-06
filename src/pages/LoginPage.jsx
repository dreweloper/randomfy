import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import queryString from 'query-string';
import { useAuth } from '../hooks';
import { generateRandomString } from '../helpers';
import { BASE_URL, REDIRECT_URI, SCOPE, STATE_KEY, STATUS } from '../utils';

export const LoginPage = () => {

  // REACT-COOKIE HOOK
  const [cookies, setCookie] = useCookies([STATE_KEY]);

  // VARIABLES
  const storedState = cookies.spotify_auth_state;

  const loginUrl = queryString.stringifyUrl({
    url: `${BASE_URL}/login`,
    query: { redirect_uri: REDIRECT_URI, scope: SCOPE, state: storedState }
  });

  // REACT-ROUTER-DOM HOOK
  const [searchParams, setSearchParams] = useSearchParams();

  // CUSTOM HOOK
  const { handleUserAuthResponse, status } = useAuth();

  // REACT HOOKS
  useEffect(() => {

    //TODO: make it change when the user's login fails: status === STATUS.FAILED (bug: status is always 'idle' at this point)
    // It will not change if the user's login succeeds.
    if (!storedState || status === STATUS.FAILED) {

      const state = generateRandomString(16);

      setCookie(STATE_KEY, state);

    };

  }, [cookies]);

  useEffect(() => {

    // Search params is not empty
    if (searchParams.size > 0) handleUserAuthResponse(searchParams);

    return () => {

      if (searchParams.size > 0) setSearchParams();

    };

  }, [searchParams]);


  return (

    <>

      <h1>Randomfy</h1>

      <Link to={loginUrl}>Login Spotify</Link>

      {
        status === STATUS.LOADING && (
          <p>Loading…</p>
        )
      }

      {
        status === STATUS.FAILED && (
          <p>Access denied!</p>
        )
      }

    </>

  );

};