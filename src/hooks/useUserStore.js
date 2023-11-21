import { useDispatch } from "react-redux";
import { fetchSpotifyData } from '../api';
import { setUser, setUserError } from "../store/slices";
import { SPOTIFY_API_BASE_URL } from '../utils';

export const useUserStore = () => {

    // REACT-REDUX HOOK
    const dispatch = useDispatch();

    // FUNCTION
    /**
     * Get detailed profile information about the current user.
     * @async
     * @function getUserProfile
     */
    const getUserProfile = async (token) => {

        /**
         * The URL for the get current user's profile Spotify API endpoint.
         * @type {String}
         */
        const url = `${SPOTIFY_API_BASE_URL}/v1/me`;

        const method = 'GET';

        try {

            /**
             * Promise that resolves with the result of parsing the response body text as JSON.
             * @type {Object}
             * @prop {String} id - The Spotify user ID.
             * @prop {String} display_name - The name displayed on the user's profile.
             * @prop {String} avatar - The source URL of the user's profile image.
             */
            const response = await fetchSpotifyData({ url, method, token });

            if (response?.ok) {

                const { id, display_name, images: [, { url: avatar }] } = response.data;

                dispatch(setUser({ id, display_name, avatar }));

                return { ok: true, id };

            };

        } catch (error) {

            dispatch(setUserError());

            throw error;

        };

    }; //!FUNC-GETUSERPROFILE


    return { getUserProfile };

};