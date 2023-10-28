import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotifyData } from '../api';
import { generateCodeChallenge, generateRandomString, serializeData } from "../helpers";
import { resetPlaylistState, resetTrackState, resetUserState } from '../store/slices';
import * as c from "../utils";

export const useAuth = () => {

  // REACT HOOKS
  const [status, setStatus] = useState(c.STATUS.IDLE);

  // REACT-COOKIE
  const [cookies, setCookie, removeCookie] = useCookies([c.ACCESS_TOKEN_KEY, c.REFRESH_TOKEN_KEY]);

  // REACT-REDUX HOOKS
  const { playlist, track, user } = useSelector(state => state);

  const dispatch = useDispatch();

  // FUNCTIONS
  const requestUserAuth = async () => {

    try {

      const codeVerifier = generateRandomString(128);

      setCookie(c.CODE_VERIFIER_KEY, codeVerifier);

      const state = generateRandomString(16);

      setCookie(c.STATE_KEY, state);

      const codeChallenge = await generateCodeChallenge(codeVerifier);

      const params = new URLSearchParams({
        response_type: c.RESPONSE_TYPE,
        client_id: c.CLIENT_ID,
        scope: c.SCOPE,
        redirect_uri: c.REDIRECT_URI,
        state,
        code_challenge_method: c.CODE_CHALLENGE_METHOD,
        code_challenge: codeChallenge,
        show_dialog: true
      });

      window.location.href = `${c.SPOTIFY_AUTH_BASE_URL}/authorize?${params}`;

    } catch (error) {

      console.error(error);

    };

  }; //!FUNC-REQUESTUSERAUTH

  const requestAccessToken = async (code) => {

    /**
     * The URL used to request the access token from the Spotify API endpoint.
     * @type {String}
     */
    const url = `${c.SPOTIFY_AUTH_BASE_URL}/api/token`;

    /**
     * The HTTP method.
     * @type {String}
     */
    const method = 'POST';

    const data = {
      grant_type: c.GRANT_TYPE.ACCESS_TOKEN,
      code,
      redirect_uri: c.REDIRECT_URI,
      client_id: c.CLIENT_ID,
      code_verifier: cookies.code_verifier
    };

    try {

      const { access_token, refresh_token } = await fetchSpotifyData({ url, method, data });

      setCookie(c.ACCESS_TOKEN_KEY, access_token, { maxAge: c.MAX_AGE.ACCESS_TOKEN });

      setCookie(c.REFRESH_TOKEN_KEY, refresh_token, { maxAge: c.MAX_AGE.REFRESH_TOKEN });

    } catch (error) {

      throw error;

    };

  }; //!FUNC-REQUESTACCESSTOKEN

  const requestRefreshedAccessToken = async () => {

    /**
     * The URL used to request the refreshed access token from the Spotify API endpoint.
     * @type {String}
     */
    const url = `${c.SPOTIFY_AUTH_BASE_URL}/api/token`;

    /**
     * The HTTP method.
     * @type {String}
     */
    const method = 'POST';

    const data = {
      grant_type: c.GRANT_TYPE.REFRESH_TOKEN,
      refresh_token: cookies.refresh_token,
      client_id: c.CLIENT_ID
    };

    try {

      const { access_token, refresh_token } = await fetchSpotifyData({ url, method, data });

      setCookie(c.ACCESS_TOKEN_KEY, access_token, { maxAge: c.MAX_AGE.ACCESS_TOKEN });

      setCookie(c.REFRESH_TOKEN_KEY, refresh_token, { maxAge: c.MAX_AGE.REFRESH_TOKEN });

    } catch (error) {

      console.error(`Error: ${error.message}`);

      // The status will inform the user that access was denied //! Status is not working (try Redux 'process' state)
      logout(c.STATUS.FAILED);

    };

  }; //!FUNC-REQUESTREFRESHEDACCESSTOKEN

  const handleUserAuthResponse = async (searchParams) => {

    try {

      setStatus(c.STATUS.LOADING);

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

      setStatus(c.STATUS.SUCCEEDED);

    } catch (error) {

      console.error(`Error: ${error.message}`);

      setStatus(c.STATUS.FAILED);

    };

  }; //!FUNC-HANDLEUSERAUTHRESPONSE

  const logout = (status = c.STATUS.IDLE) => {

    if (cookies.access_token) removeCookie(c.ACCESS_TOKEN_KEY);

    if (cookies.refresh_token) removeCookie(c.REFRESH_TOKEN_KEY);

    if (!user.isEmpty) dispatch(resetUserState());

    if (!playlist.isEmpty) dispatch(resetPlaylistState());

    if (!track.isEmpty) dispatch(resetTrackState());

    //TODO: reset or set 'status' prop of 'process' Redux state instead of using useState.
    setStatus(status);

  }; //!FUNC-HANDLELOGOUT


  return {
    status,
    handleUserAuthResponse,
    logout,
    requestUserAuth,
    requestRefreshedAccessToken
  };

};