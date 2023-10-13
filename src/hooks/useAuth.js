import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import queryString from 'query-string';
import { serializeData } from '../helpers';
import { deleteUser, removeTracks } from '../store/slices';
import { ACCESS_TOKEN_KEY, BASE_URL, REDIRECT_URI, REFRESH_TOKEN_KEY, STATE_KEY, STATUS } from '../utils';

export const useAuth = () => {

  // REACT HOOK
  const [status, setStatus] = useState(STATUS.IDLE);

  // REACT-REDUX HOOK
  const dispatch = useDispatch();

  // REACT-ROUTER-DOM HOOK
  const [searchParams, setSearchParams] = useSearchParams();

  // REACT-COOKIE HOOK
  const [cookies, setCookie, removeCookie] = useCookies([STATE_KEY]); // Dependencies: cookie name that the component (LoginPage) depend on or that should trigger a re-render

  // FUNCTIONS
  const handleLogout = (status = STATUS.IDLE) => {

    //TODO: if 'cookie.access_token' is not undefined
    removeCookie(ACCESS_TOKEN_KEY);

    //TODO: if 'cookie.refresh_token' is not undefined
    removeCookie(REFRESH_TOKEN_KEY);

    //TODO: if 'user' state is not empty
    dispatch(deleteUser());

    //TODO: if 'tracks' state is not empty
    dispatch(removeTracks());

    setStatus(status);

  }; //!FUNC-HANDLELOGOUT

  const requestAccessToken = async (code, state, redirect_uri) => {

    /**
     * The access token endpoint on the backend server.
     * @type {String}
     */
    const url = queryString.stringifyUrl({ url: `${BASE_URL}/access-token`, query: { code, state, redirect_uri } });

    try {

      const response = await fetch(url);

      if (!response.ok) {

        throw new Error('Failed to obtain access token');

      } else {

        const { access_token, refresh_token } = await response.json();

        setCookie(ACCESS_TOKEN_KEY, access_token, { maxAge: 3600 });

        setCookie(REFRESH_TOKEN_KEY, refresh_token, { maxAge: 60 * 60 * 24 * 365 });

      };

    } catch (error) {

      throw error;

    };

  }; //!FUNC-REQUESTACCESSTOKEN

  const handleUserAuthResponse = async () => {

    setStatus(STATUS.LOADING);

    /**
     * The 'state' parameter stored in cookies.
     * @type {String}
     */
    const storedState = cookies.spotify_auth_state;

    try {

      /**
       * An object that represents the serialized query string from the Spotify API response obtained after user authorization.
       * @type {Object}
       */
      const query = serializeData(searchParams);

      /**
       * First validation:
       * If the user does not accept your request or if an error has occurred,
       * the response query string contains the following parameters:
       * error: The reason authorization failed, for example: "access_denied"
       * state: The value of the state parameter supplied in the request.
       */
      if (query.error) {

        throw new Error('Access denied');

        /**
         * Second validation:
         * Compares the state parameter that the app received in the redirection URI
         * with the state parameter it originally provided to Spotify in the authorization URI.
         */
      } else if (storedState !== query.state) {

        throw new Error('State mismatch');

      } else {

        await requestAccessToken(query.code, query.state, REDIRECT_URI);

        setStatus(STATUS.SUCCEEDED);

      };

    } catch (error) {

      console.error(error.message);

      setStatus(STATUS.FAILED);

    } finally {

      // Clear the search params
      setSearchParams();

    };

  }; //!FUNC-HANDLEUSERAUTHRESPONSE

  const requestRefreshedAccessToken = async (refresh_token) => {

    /**
     * The refresh token endpoint on the backend server.
     * @type {String}
     */
    const url = queryString.stringifyUrl({ url: `${BASE_URL}/refresh-token`, query: { refresh_token } });

    try {

      const response = await fetch(url);

      if (!response.ok) {

        throw new Error('Failed to obtain access token with refresh token');

      } else {

        const { access_token } = await response.json();

        setCookie(ACCESS_TOKEN_KEY, access_token, { maxAge: 3600 });

      };

    } catch (error) {

      console.error(error.message);

      // The status will inform the user that access was denied //! It's not working
      handleLogout(STATUS.FAILED);

    };

  }; //!FUNC-REQUESTREFRESHEDACCESSTOKEN

  useEffect(() => {

    // Search params are not empty. It indicates that the user has clicked the login button
    if (searchParams.size > 0) handleUserAuthResponse();

  }, [searchParams]);


  return {
    handleLogout,
    requestRefreshedAccessToken,
    cookies,
    setCookie,
    status
  };

};