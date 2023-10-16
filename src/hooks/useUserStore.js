import { useEffect } from "react";
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from "react-redux";
import { finishLoading, setError, setUser, startLoading } from "../store/slices";
import { ACCESS_TOKEN_KEY, SPOTIFY_BASE_URL } from '../utils';

export const useUserStore = () => {

    // REACT-REDUX HOOKS
    const user = useSelector(state => state.user);

    const dispatch = useDispatch();

    // REACT-COOKIE HOOK
    const [cookies] = useCookies([ACCESS_TOKEN_KEY]);

    // VARIABLES
    /**
     * The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
     * @type {String}
     */
    const token = cookies.access_token;

    /**
     * Options for making authenticated requests to the Spotify API using the Fetch API.
     * @type {Object}
     * @prop {Object} headers - Headers for the request.
     * @prop {String} headers.Authorization - The Authorization header with a bearer token.
     */
    const fetchOptions = { headers: { Authorization: `Bearer ${token}` } };

    // FUNCTIONS
    /**
     * Get detailed profile information about the current user.
     * @async
     * @function getUserProfile
     */
    const getUserProfile = async () => {

        try {

            dispatch(startLoading());

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
                 * @prop {String} avatar - The source URL of the user's profile image.
                 */
                const { id, display_name, images: [, { url: avatar }] } = await response.json();

                dispatch(setUser({ id, display_name, avatar }));

            };

        } catch (error) {

            console.error(error.message);

            dispatch(setError());

        } finally {

            dispatch(finishLoading());

        };

    };

    useEffect(() => {

        /**
         * Indicates whether the 'user' state is empty, based on the length of its 'id' property.
         * @type {Boolean}
         */
        const userIsEmpty = user.id.length === 0;

        /**
         * This 'useEffect' should be triggered only once, during the initial loading of the 'user' state.
         * First condition: the token is valid and not expired.
         * Second condition: the 'user' state is empty, so the function will be invoked only once.
         * Additionally, it prevents unnecessary re-renders when navigating with web browser arrows.
         */
        if (token && userIsEmpty) getUserProfile();

    }, [cookies]); // It will trigger again if the token has expired when the component is initially mounted.


    return { user };

};