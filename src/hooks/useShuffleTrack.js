import { useDispatch, useSelector } from "react-redux";
import { useAuth, usePlaylistStore, useTrackStore, useUserStore } from "./index";
import { setStatus } from "../store/slices";
import { STATUS } from "../utils";

export const useShuffleTrack = () => {

    // REACT-REDUX HOOKS
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

            dispatch(setStatus(STATUS.LOADING));

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

                        dispatch(setStatus(STATUS.SUCCEEDED));

                    };
                };
            };

        } catch (error) {

            console.error(error);

            if (error.message === 'Refresh token revoked' || error.message === 'Invalid refresh token') {

                logout();

            };

            dispatch(setStatus(STATUS.FAILED));

            //TODO: status >= 400 ... status >= 500... set Redux status failed and message to render.

        };

    }; //!FUNC-SHUFFLETRACK


    return { shuffleTrack };

};