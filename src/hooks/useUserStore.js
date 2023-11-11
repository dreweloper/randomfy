import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchSpotifyData } from '../api';
import { setStatus, setUser, setUserError } from "../store/slices";
import { SPOTIFY_API_BASE_URL, STATUS } from '../utils';

export const useUserStore = ({ token, user }) => {

    // REACT HOOK
    /**
     * Used to track whether the user data has been loaded to prevent multiple calls.
     * @type {React.MutableRefObject<Boolean>}
     */
    const isLoaded = useRef(false);

    // REACT-REDUX HOOK
    const dispatch = useDispatch();

    // FUNCTION
    /**
     * Get detailed profile information about the current user.
     * @async
     * @function getUserProfile
     */
    const getUserProfile = async () => {

        /**
         * The URL for the get current user's profile Spotify API endpoint.
         * @type {String}
         */
        const url = `${SPOTIFY_API_BASE_URL}/v1/me`;

        const method = 'GET';

        try {

            dispatch(setStatus(STATUS.LOADING));

            /**
             * Promise that resolves with the result of parsing the response body text as JSON.
             * @type {Object}
             * @prop {String} id - The Spotify user ID.
             * @prop {String} display_name - The name displayed on the user's profile.
             * @prop {String} avatar - The source URL of the user's profile image.
             */
            const response = await fetchSpotifyData({ url, method, token });

            const { id, display_name, images: [, { url: avatar }] } = response;

            dispatch(setUser({ id, display_name, avatar }));

        } catch (error) {

            console.error(error);

            dispatch(setUserError());

            dispatch(setStatus(STATUS.FAILED));

        };

    }; //!FUNC-GETUSERPROFILE

    // REACT-HOOK
    useEffect(() => {

        /**
         * On init, if the token is expired, the useEffect will be triggered again.
         * If the 'user' state remains empty, invokes the 'getUserProfile' function
         * and updates the 'isLoaded' ref value to prevent multiple subsequent calls.
         */
        if (token && user.isEmpty && !isLoaded.current) {

            isLoaded.current = true;

            getUserProfile();

        };

    }, [token]);

};