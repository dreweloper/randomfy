import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { generateRandomString } from '../helpers';
import { useAuth } from '../hooks';
import { BASE_URL, REDIRECT_URI, SCOPE, STATE_KEY, STATUS } from '../utils';

export const LoginPage = () => {

  // REACT-COOKIE HOOK
  const [cookies, setCookie] = useCookies([STATE_KEY]);

  // CUSTOM HOOK
  const { status } = useAuth();

  // VARIABLES
  const storedState = cookies.spotify_auth_state;

  const url = queryString.stringifyUrl({
    url: `${BASE_URL}/login`,
    query: { redirect_uri: REDIRECT_URI, scope: SCOPE, state: storedState }
  });

  // REACT HOOK
  useEffect(() => {

    //TODO: make it change when the user's login fails: status === STATUS.FAILED (bug: it's not working. Status is always 'idle' at this point)
    // It will not change if the user's login succeeds
    if (!storedState) {

      const state = generateRandomString(16);

      setCookie(STATE_KEY, state);

    };

  }, [cookies]);


  return (

    <>

      <h1>Randomfy</h1>

      <Link to={url}>Login Spotify</Link>

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