import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import queryString from 'query-string';
import Cookies from 'universal-cookie';

function App () {

  // VARIABLES
  const cookies = new Cookies();

  const urlBase = 'http://localhost:3000/api';
  const stateKey = 'spotify_auth_state';
  const redirect_uri = 'http://localhost:5173';

  const loginUrl = queryString.stringifyUrl({
    url: `${urlBase}/login`,
    query: {
      redirect_uri,
      scope: 'ugc-image-upload user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-read-playback-position user-top-read user-read-recently-played user-library-modify user-library-read user-read-email user-read-private',
      stateKey
    }
  });

  // REACT HOOKS
  const [query, setQuery] = useState({});
  const [authError, setAuthError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // REACT ROUTER DOM HOOK
  const [searchParams, setSearchParams] = useSearchParams();

  const requestAccessToken = async (code, state, redirect_uri) => {

    const accessTokenUrl = queryString.stringifyUrl({
      url: `${urlBase}/access-token`,
      query: { code, state, redirect_uri }
    });

    try {
      
      const response = await fetch(accessTokenUrl);

      if(response.ok) {

        const { access_token, refresh_token } = await response.json();

        cookies.set('access_token', access_token, { sameSite: 'strict' });

        cookies.set('refresh_token', refresh_token, { sameSite: 'strict' });

      } else {

        throw new Error('Failed to obtain access token');

      };

    } catch (error) {

      console.log(error);
      
      setAuthError(true);

    } finally {

      setIsLoading(false);

    };

  };

  useEffect(() => {

    const storedState = cookies.get(stateKey);
    
    // It triggers when there is at least 1 query param
    if (searchParams.size > 1) {

      setIsLoading(true);

      const queryParams = {};

      for(const [key, value] of searchParams) {
        
        queryParams[key] = value;

      };

      /**
       * First validation:
       * If the user does not accept your request or if an error has occurred,
       * the response query string contains the following parameters:
       * error: The reason authorization failed, for example: "access_denied"
       * state: The value of the state parameter supplied in the request.
       */
      if (queryParams.error) {

        setAuthError(true);

        setIsLoading(false);

      } else {

        /**
         * Second validation:
         * Compares the state parameter that the app received in the redirection URI
         * with the state parameter it originally provided to Spotify in the authorization URI.
         */
        if (storedState !== queryParams.state) {

          setAuthError(true);

          setIsLoading(false);
          
        } else {

          setQuery(queryParams);

        };

      };

    };
  
    return () => {

      setSearchParams();

      setTimeout(() => {
        
        if(storedState) cookies.remove(stateKey);

      }, 500);
      
    };

  }, [searchParams]);

  useEffect(() => {

    const queryIsNotEmpty = Object.keys(query).length > 0;

    if(queryIsNotEmpty) requestAccessToken(query.code, query.state, redirect_uri);

    return () => {

      if(queryIsNotEmpty) setQuery({});

    };

  }, [query]);
  

  return (

    <>
      <h1>Randomfy</h1>

      <Link to={loginUrl}>Login Spotify</Link>

      {
        isLoading && <p>Loading…</p>
      }

      {
        authError && <p>Access denied!</p>
      }

    </>

  );

};

export default App;
