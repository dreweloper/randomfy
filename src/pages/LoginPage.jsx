import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import queryString from 'query-string';
import { useAuth } from '../hooks';
import { generateRandomString } from '../helpers';
import { BASE_URL, REDIRECT_URI, SCOPE, STATE_KEY } from '../utils';

export const LoginPage = () => {

  // REACT-COOKIE HOOK
  const [cookies, setCookie] = useCookies();

  // REACT-ROUTER-DOM HOOK
  const [searchParams, setSearchParams] = useSearchParams();

  // CUSTOM HOOK
  const { handleUserAuthResponse, isLoading, isAuthError } = useAuth();

  // VARIABLES
  const loginUrl = queryString.stringifyUrl({
    url: `${BASE_URL}/login`,
    query: { redirect_uri: REDIRECT_URI, scope: SCOPE, state: cookies.spotify_auth_state }
  });

  // REACT HOOKS
  useEffect(() => {

    const state = generateRandomString(16);

    setCookie(STATE_KEY, state);

  }, []);

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
        isLoading && <p>Loading…</p>
      }

      {
        isAuthError && <p>Access denied!</p>
      }

    </>

  );

};