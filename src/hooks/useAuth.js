import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { generateCodeChallenge, generateRandomString, serializeData } from "../helpers";
import { deleteUser, resetPlaylistState, resetTrackState } from '../store/slices';
import * as Constants from "../utils";

export const useAuth = () => {

  // REACT HOOK
  const [status, setStatus] = useState(Constants.STATUS.IDLE);

  // REACT-COOKIE
  const [cookies, setCookie, removeCookie] = useCookies([Constants.ACCESS_TOKEN_KEY, Constants.REFRESH_TOKEN_KEY]);

  // REACT-ROUTER-DOM HOOK
  const [searchParams, setSearchParams] = useSearchParams();

  // REACT-REDUX HOOK
  const dispatch = useDispatch();

  // FUNCTIONS
  const requestUserAuth = async () => {

    try {

      const codeVerifier = generateRandomString(128);

      setCookie(Constants.CODE_VERIFIER_KEY, codeVerifier);

      const state = generateRandomString(16);

      setCookie(Constants.STATE_KEY, state);

      const codeChallenge = await generateCodeChallenge(codeVerifier);

      const params = new URLSearchParams({
        response_type: Constants.RESPONSE_TYPE,
        client_id: Constants.CLIENT_ID,
        scope: Constants.SCOPE,
        redirect_uri: Constants.REDIRECT_URI,
        state: state,
        code_challenge_method: Constants.CODE_CHALLENGE_METHOD,
        code_challenge: codeChallenge,
        show_dialog: true
      });

      window.location.href = `${Constants.SPOTIFY_AUTH_BASE_URL}/authorize?${params}`;

    } catch (error) {

      console.error(error);

    };

  }; //!FUNC-REQUESTUSERAUTH

  const requestAccessToken = async (code) => {

    /**
     * The URL used to request the access token from the Spotify API endpoint.
     * @type {String}
     */
    const url = `${Constants.SPOTIFY_AUTH_BASE_URL}/api/token`;

    const options = {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: Constants.GRANT_TYPE.ACCESS_TOKEN,
        code: code,
        redirect_uri: Constants.REDIRECT_URI,
        client_id: Constants.CLIENT_ID,
        code_verifier: cookies.code_verifier
      }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };

    try {

      const response = await fetch(url, options);

      if (!response.ok) throw new Error('Failed to obtain access token');

      const { access_token, refresh_token } = await response.json();

      setCookie(Constants.ACCESS_TOKEN_KEY, access_token, { maxAge: 3600 });

      setCookie(Constants.REFRESH_TOKEN_KEY, refresh_token, { maxAge: 60 * 60 * 24 * 7 });

    } catch (error) {

      throw error;

    };

  }; //!FUNC-REQUESTACCESSTOKEN

  const requestRefreshedAccessToken = async () => {

    /**
     * The URL used to request the refreshed access token from the Spotify API endpoint.
     * @type {String}
     */
    const url = `${Constants.SPOTIFY_AUTH_BASE_URL}/api/token`;

    /**
     * Options for making authenticated requests to the Spotify API using the Fetch API.
     * @type {Object}
     */
    const options = {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: Constants.GRANT_TYPE.REFRESH_TOKEN,
        refresh_token: cookies.refresh_token,
        client_id: Constants.CLIENT_ID
      }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };

    try {

      const response = await fetch(url, options);

      if (!response.ok) throw new Error('Failed to obtain access token with refresh token');

      const { access_token, refresh_token } = await response.json();

      setCookie(Constants.ACCESS_TOKEN_KEY, access_token, { maxAge: 3600 });

      setCookie(Constants.REFRESH_TOKEN_KEY, refresh_token, { maxAge: 60 * 60 * 24 * 7 });

    } catch (error) {
      
      console.error(error.message);

      // The status will inform the user that access was denied //! Status is not working
      logout(Constants.STATUS.FAILED);

    };

  }; //!FUNC-REQUESTREFRESHEDACCESSTOKEN

  const handleUserAuthResponse = async () => {

    try {

      setStatus(Constants.STATUS.LOADING);

      /**
       * An object that represents the serialized query string from the Spotify API response obtained after user authorization.
       * @type {Object}
       */
      const params = serializeData(searchParams);

      /**
       * First validation:
       * If the user does not accept the request or if an error has occurred,
       * the response query string contains the following parameters:
       * error: The reason authorization failed, for example: "access_denied"
       * state: The value of the state parameter supplied in the request.
       */
      if (params.error) throw new Error('Access denied');

      /**
       * Second validation:
       * Compares the state parameter that the app received in the redirection URI
       * with the state parameter it originally provided to Spotify in the authorization URI stored in the cookies.
       */
      if (cookies.spotify_auth_state !== params.state) throw new Error('State mismatch');

      await requestAccessToken(params.code);

      setStatus(Constants.STATUS.SUCCEEDED);

    } catch (error) {

      console.error(error.message);

      setStatus(Constants.STATUS.FAILED);

    };

  }; //!FUNC-HANDLEUSERAUTHRESPONSE

  const logout = (status = Constants.STATUS.IDLE) => {

    //TODO: if 'cookie.access_token' is not undefined
    removeCookie(Constants.ACCESS_TOKEN_KEY);

    //TODO: if 'cookie.refresh_token' is not undefined
    removeCookie(Constants.REFRESH_TOKEN_KEY);

    //TODO: if 'user' state is not empty
    dispatch(deleteUser());

    //TODO: if 'playlist' state is not empty
    dispatch(resetPlaylistState());

    //TODO: if 'track' state is not empty
    dispatch(resetTrackState());

    setStatus(status);

  }; //!FUNC-HANDLELOGOUT

  useEffect(() => {
    //TODO: logic to prevent multiple calls to 'requestAccessToken' in 'handleUserAuthResponse' (with and w/o 'React.StrictMode').
    /**
     * Search params are not empty. It indicates that the user has clicked the login button.
     * Once the user accepts or denied the requested permissions, the OAuth service redirects the user back to the URL specified in the 'redirect_uri' field.
     */
    if (searchParams.size > 0) handleUserAuthResponse();

  }, [searchParams]);


  return {
    status,
    logout,
    requestUserAuth,
    requestRefreshedAccessToken
  };

};