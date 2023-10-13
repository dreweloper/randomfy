import { useEffect } from "react";
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserStatus } from "../store/slices";
import { ACCESS_TOKEN_KEY, SPOTIFY_BASE_URL, STATUS } from '../utils';

export const useUserStore = () => {

    // REACT-REDUX HOOKS
    const { user, userStatus } = useSelector(state => state.user);

    const dispatch = useDispatch();

    // REACT-COOKIE HOOK
    const [cookies] = useCookies([ACCESS_TOKEN_KEY]);

    // VARIABLES
    /**
     * The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
     * @type {String}
     */
    const token = cookies.access_token;

    // FUNCTIONS
    /**
     * Get detailed profile information about the current user.
     * @async
     * @function getUserProfile
     */
    const getUserProfile = async () => {

        dispatch(setUserStatus(STATUS.LOADING));

        /**
         * Options for making authenticated requests to the Spotify API using the Fetch API.
         * @type {Object}
         * @prop {Object} headers - Headers for the request.
         * @prop {String} headers.Authorization - The Authorization header with a bearer token.
         */
        const fetchOptions = { headers: { Authorization: `Bearer ${token}` } };

        try {

            /**
             * The Spotify API response object.
             * @type {Object}
             */
            const response = await fetch(`${SPOTIFY_BASE_URL}/v1/me`, fetchOptions);

            if (!response.ok) {

                throw new Error("Failed to obtain user's profile");

            } else {

                /**
                 * Promise that resolves with the result of parsing the response body text as JSON.
                 * @type {Object}
                 * @prop {String} id - The Spotify user ID.
                 * @prop {String} display_name - The name displayed on the user's profile.
                 * @prop {String} image_url - The source URL of the user's profile image.
                 */
                const { id, display_name, images: [, { url: image_url }] } = await response.json();

                dispatch(setUser({ id, display_name, image_url }));

            };

        } catch (error) {

            console.error(error.message);

            dispatch(setUserStatus(STATUS.FAILED));

        };

    };

    useEffect(() => {

        // The token is both valid and not expired. It also checks whether the 'user' property of the state is empty to prevent unnecessary re-renders.
        if (token && Object.keys(user).length === 0) getUserProfile();

    }, [cookies]);


    return { user, userStatus };

};