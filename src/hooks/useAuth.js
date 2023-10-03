import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import queryString from 'query-string';
import { serializeData } from '../helpers';
import { deleteUser, removeTracks } from '../store/slices';
import { ACCESS_TOKEN_KEY, BASE_URL, REDIRECT_URI, REFRESH_TOKEN_KEY, STATE_KEY } from '../utils';

export const useAuth = () => {

  // REACT HOOKS
  const [query, setQuery] = useState({});

  const [isAuthError, setIsAuthError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // REACT-REDUX HOOK
  const dispatch = useDispatch();

  // REACT-COOKIE HOOK
  const [cookies, setCookie, removeCookie] = useCookies([STATE_KEY]);

  // FUNCTIONS
  const handleLogout = () => {

    removeCookie(ACCESS_TOKEN_KEY);

    removeCookie(REFRESH_TOKEN_KEY);

    dispatch(deleteUser());

    dispatch(removeTracks());

  };

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
      if (queryParams.error) {

        throw new Error('Access denied');

        /**
         * Second validation:
         * Compares the state parameter that the app received in the redirection URI
         * with the state parameter it originally provided to Spotify in the authorization URI.
         */
      } else if (storedState !== queryParams.state) {

        throw new Error('State mismatch');

      } else {

        setQuery(queryParams);

      };

    } catch (error) {

      console.error(error.message);

      setIsAuthError(true);

      setIsLoading(false);

    } finally {

      removeCookie(STATE_KEY);

    };

  };

  const requestAccessToken = async (code, state, redirect_uri) => {

    const accessTokenUrl = queryString.stringifyUrl({
      url: `${BASE_URL}/access-token`,
      query: { code, state, redirect_uri }
    });

    try {

      const response = await fetch(accessTokenUrl);

      if (response.ok) {

        const { access_token, refresh_token } = await response.json();

        setCookie(ACCESS_TOKEN_KEY, access_token, { maxAge: 3600 });

        setCookie(REFRESH_TOKEN_KEY, refresh_token, { maxAge: 60 * 60 * 24 * 365 });

      } else {

        throw new Error('Failed to obtain access token');

      };

    } catch (error) {

      console.error(error.message);

      setIsAuthError(true);

    } finally {

      setQuery({});

      setIsLoading(false);

    };

  };

  const requestRefreshedAccessToken = async (refresh_token) => {

    const refreshTokenUrl = queryString.stringifyUrl({
      url: `${BASE_URL}/refresh-token`,
      query: { refresh_token }
    });

    try {

      const response = await fetch(refreshTokenUrl);

      if (response.ok) {

        const { access_token } = await response.json();

        setCookie(ACCESS_TOKEN_KEY, access_token, { maxAge: 3600 });

      } else {

        throw new Error('Failed to obtain access token with refresh token');

      };

    } catch (error) {

      console.error(error.message);

      handleLogout();

    };

  };

  useEffect(() => {

    // State 'query' is not empty
    if (Object.keys(query).length > 0) requestAccessToken(query.code, query.state, REDIRECT_URI);

  }, [query]);


  return {
    handleLogout,
    handleUserAuthResponse,
    requestRefreshedAccessToken,
    isLoading,
    isAuthError
  };

};