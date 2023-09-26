import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import queryString from 'query-string';
import { serializeData } from '../helpers';
import * as authConst from '../utils';

export const useAuth = () => {

    // REACT HOOKS
    const [query, setQuery] = useState({});
    const [isAuthError, setIsAuthError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // REACT-COOKIE HOOK
    const [cookies, setCookie, removeCookie] = useCookies([authConst.STATE_KEY]);

    // FUNCTIONS
    const handleUserAuthResponse = (searchParams) => {

      setIsLoading(true);

      const storedState = cookies.spotify_auth_state;

      try {

        const queryParams = serializeData(searchParams);

        /**
         * First validation:
         * If the user does not accept your request or if an error has occurred,
         * the response query string contains the following parameters:
         * error: The reason authorization failed, for example: "access_denied"
         * state: The value of the state parameter supplied in the request.
         */
        if(queryParams.error) {

          throw new Error('Access denied');

        /**
         * Second validation:
         * Compares the state parameter that the app received in the redirection URI
         * with the state parameter it originally provided to Spotify in the authorization URI.
         */
        } else if(storedState !== queryParams.state) {

          throw new Error('State mismatch');
          
        } else {

          setQuery(queryParams);

        };
        
      } catch (error) {

        console.error(error.message);

        setIsAuthError(true);

        setIsLoading(false);
        
      } finally {

        removeCookie(authConst.STATE_KEY);

      };
      
    };

    const requestAccessToken = async (code, state, redirect_uri) => {
  
        const accessTokenUrl = queryString.stringifyUrl({
          url: `${authConst.URL_BASE}/access-token`,
          query: { code, state, redirect_uri }
        });
    
        try {
          
          const response = await fetch(accessTokenUrl);
    
          if(response.ok) {
    
            const { access_token, refresh_token } = await response.json();
    
            setCookie('access_token', access_token);
    
            setCookie('refresh_token', refresh_token);
    
          } else {
    
            throw new Error('Failed to obtain access token');
    
          };
    
        } catch (error) {
    
          console.error(error.message);
          
          setIsAuthError(true);
    
        } finally {
    
          setIsLoading(false);
    
        };

    };  

    useEffect(() => {
  
      const queryIsNotEmpty = Object.keys(query).length > 0;
    
      if(queryIsNotEmpty) requestAccessToken(query.code, query.state, authConst.REDIRECT_URI);
    
      return () => {
    
        if(queryIsNotEmpty) setQuery({});
    
      };
    
    }, [query]);


    return {
        handleUserAuthResponse,
        isLoading,
        isAuthError
    };

};