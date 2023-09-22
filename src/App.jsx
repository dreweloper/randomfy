import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Cookies from 'universal-cookie';

function App () {

  const cookies = new Cookies();

  const [query, setQuery] = useState({});
  const [authError, setAuthError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const requestAccessToken = async (code, state) => {

    try {
      
      const response = await fetch(`http://localhost:3000/api/access-token/?code=${code}&state=${state}`);

      if(response.ok) {

        const { access_token, refresh_token } = await response.json();

        cookies.set('access_token', access_token);

        cookies.set('refresh_token', refresh_token);

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

    const stateKey = 'spotify_auth_state';

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

    if(queryIsNotEmpty) requestAccessToken(query.code, query.state);

    return () => {

      if(queryIsNotEmpty) setQuery({});

    };

  }, [query]);
  

  return (

    <>
      <h1>Randomfy</h1>

      <Link to='http://localhost:3000/api/login'>LogIn Spotify</Link>

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
