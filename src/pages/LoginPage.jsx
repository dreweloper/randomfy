import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { useAuth } from '../hooks';
import { BASE_URL, REDIRECT_URI, SCOPE, STATUS } from '../utils';

export const LoginPage = () => {

  // CUSTOM HOOK
  const { status, storedState } = useAuth();

  // VARIABLES
  /**
   * The login endpoint on the backend server.
   * @type {String}
   */
  const url = queryString.stringifyUrl({ url: `${BASE_URL}/login`, query: { redirect_uri: REDIRECT_URI, scope: SCOPE, state: storedState } });


  return (

    <>

      <h1>Randomfy</h1>

      <Link to={url}>Login Spotify</Link>

      {
        status === STATUS.LOADING && <p>Loading…</p>
      }

      {
        status === STATUS.FAILED && <p>Access denied!</p>
      }

    </>

  );

};