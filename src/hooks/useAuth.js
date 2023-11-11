import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchSpotifyData } from '../api';
import { generateCodeChallenge, generateRandomString, serializeData } from "../helpers";
import { resetPlaylistState, resetTrackState, resetUserState, setStatus } from '../store/slices';
import * as c from "../utils";

export const useAuth = () => {

  // REACT HOOKS
  const [isLoading, setIsLoading] = useState(false);

  const [isError, setIsError] = useState(false);

  // REACT-REDUX HOOKS
  const playlist = useSelector(state => state.playlist);

  const track = useSelector(state => state.track);

  const user = useSelector(state => state.user);

  const dispatch = useDispatch();

  // REACT-COOKIE HOOK
  const [cookies, setCookie, removeCookie] = useCookies();

  // REACT-ROUTER-DOM HOOK
  const [searchParams, setSearchParams] = useSearchParams();

  // VARIABLES
  /**
   * The 'state' parameter that was initially provided to Spotify.
   * @type {String}
   */
  const storedState = cookies.spotify_auth_state;

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

      const response = await fetchSpotifyData({ url, method, data });

      const { access_token, refresh_token } = response;

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

      const response = await fetchSpotifyData({ url, method, data });

      const { access_token, refresh_token } = response;

      setCookie(c.ACCESS_TOKEN_KEY, access_token, { maxAge: c.MAX_AGE.ACCESS_TOKEN });

      setCookie(c.REFRESH_TOKEN_KEY, refresh_token, { maxAge: c.MAX_AGE.REFRESH_TOKEN });

      return { ok: true };

    } catch (error) {

      if (error?.error_description === 'Invalid refresh token') logout();

      throw error;

    };

  }; //!FUNC-REQUESTREFRESHEDACCESSTOKEN

  const handleUserAuthResponse = async () => {

    try {

      setIsLoading(true);

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
      if (storedState !== params.state) throw new Error('State mismatch');

      await requestAccessToken(params.code);

    } catch (error) {

      console.error(error);

      setIsError(true);

    } finally {

      // Always clear the URL search parameters.
      setSearchParams();

      removeCookie(c.STATE_KEY);

      removeCookie(c.CODE_VERIFIER_KEY);

      setIsLoading(false);

    };

  }; //!FUNC-HANDLEUSERAUTHRESPONSE

  const logout = () => {

    if (cookies?.access_token) removeCookie(c.ACCESS_TOKEN_KEY);

    if (cookies?.refresh_token) removeCookie(c.REFRESH_TOKEN_KEY);

    if (!user.isEmpty) dispatch(resetUserState());

    if (!playlist.isEmpty) dispatch(resetPlaylistState());

    if (!track.isEmpty) dispatch(resetTrackState());

    dispatch(setStatus(c.STATUS.IDLE));

  }; //!FUNC-HANDLELOGOUT


  return {
    isError,
    isLoading,
    searchParams,
    handleUserAuthResponse,
    logout,
    requestUserAuth,
    requestRefreshedAccessToken
  };

};