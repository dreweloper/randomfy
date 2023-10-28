import { useDispatch } from "react-redux";
import { fetchSpotifyData } from '../api';
import { setError, setUser, startLoading } from "../store/slices";
import { SPOTIFY_API_BASE_URL } from '../utils';

export const useUserStore = (token) => {

    // REACT-REDUX HOOKS
    const dispatch = useDispatch();

    // FUNCTIONS
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

            dispatch(startLoading());

            /**
             * Promise that resolves with the result of parsing the response body text as JSON.
             * @type {Object}
             * @prop {String} id - The Spotify user ID.
             * @prop {String} display_name - The name displayed on the user's profile.
             * @prop {String} avatar - The source URL of the user's profile image.
             */
            const { id, display_name, images: [, { url: avatar }] } = await fetchSpotifyData({ url, method, token });

            dispatch(setUser({ id, display_name, avatar }));

        } catch (error) {

            console.error(`Error: ${error.message}`);

            dispatch(setError());

        };

    }; //!FUNC-GETUSERPROFILE


    return { getUserProfile };

};