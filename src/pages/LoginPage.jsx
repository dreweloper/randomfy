import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import queryString from 'query-string';
import { useAuth } from '../hooks';
import { BASE_URL, REDIRECT_URI, SCOPE, STATE_KEY } from '../utils';

export const LoginPage = () => {

  const loginUrl = queryString.stringifyUrl({
    url: `${BASE_URL}/login`,
    query: { redirect_uri: REDIRECT_URI, scope: SCOPE, stateKey: STATE_KEY }
  });

  // REACT-ROUTER-DOM HOOK
  const [searchParams, setSearchParams] = useSearchParams();

  // CUSTOM HOOK
  const { handleUserAuthResponse, isLoading, isAuthError } = useAuth();

  // REACT HOOK
  useEffect(() => {

    const searchParamsIsNotEmpty = searchParams.size > 0;

    if (searchParamsIsNotEmpty) handleUserAuthResponse(searchParams);

    return () => {

      if (searchParamsIsNotEmpty) setSearchParams();

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