import { useDispatch, useSelector } from "react-redux";
import { useAuth, usePlaylistStore, useTrackStore, useUserStore } from "./index";
import { setErrorMessage } from "../helpers";
import { setStatus } from "../store/slices";
import { STATUS } from "../utils";

export const useShuffleTrack = () => {

    // REACT-REDUX HOOKS
    const status = useSelector(state => state.process.status);

    const user = useSelector(state => state.user);

    const dispatch = useDispatch();

    // CUSTOM HOOKS
    const { checkTokenValidity, logout } = useAuth();

    const { getUserProfile } = useUserStore();

    const { getRandomPlaylist } = usePlaylistStore();

    const { getRandomTrack } = useTrackStore();

    // FUNCTIONS
    /**
     * @async
     * @function shuffleTrack
     */
    const shuffleTrack = async () => {

        /**
         * On the initial load, 'user.id' is an empty string due to 'user.isEmpty'.
         * Subsequently, 'getUserProfile' sets the new 'user.id'.
         * After the first load is completed, '!user.isEmpty' ensures 'user.id' is already set.
         * 
         * The Spotify user ID for the user.
         * @type {String}
         */
        let userId = user.id;

        try {

            // After a successful user login, the status is already set to 'loading'.
            if (status !== STATUS.LOADING) {

                dispatch(setStatus({ status: STATUS.LOADING }));

            };

            let response = await checkTokenValidity();

            if (response?.ok) {

                const token = response.token; // The 'checkTokenValidity' response.

                // This will only be triggered during the initial load.
                if (user.isEmpty) {

                    response = await getUserProfile(token);

                    if (response?.ok) {

                        userId = response.id; // The 'getUserProfile' response.

                    };

                };

                response = await getRandomPlaylist(token, userId);

                if (response?.ok) {

                    const { playlistId, totalTracks } = response; // The 'getRandomPlaylist' response;

                    response = await getRandomTrack(token, playlistId, totalTracks);

                    if (response?.ok) {

                        dispatch(setStatus({ status: STATUS.SUCCEEDED }));

                    };
                };
            };

        } catch (error) {

            console.error(error);

            if (error.message === 'Refresh token revoked' || error.message === 'Invalid refresh token') {

                // Unauthorized.
                error.status = 401;

                logout();

            };

            const message = setErrorMessage(error.status);

            dispatch(setStatus({
                status: STATUS.FAILED,
                message
            }));

        };

    }; //!FUNC-SHUFFLETRACK


    return { shuffleTrack };

};