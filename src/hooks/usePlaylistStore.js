import { useDispatch, useSelector } from "react-redux";
import { fetchSpotifyData } from "../api";
import { generateRandomNumber } from '../helpers';
import { isPlaylistFollowed, setPlaylist, setStatus } from '../store/slices';
import { SPOTIFY_API_BASE_URL, STATUS, USER_ID } from "../utils";

export const usePlaylistStore = (token) => {

    // REACT-REDUX HOOKS
    const user = useSelector(state => state.user);

    const dispatch = useDispatch();

    // FUNCTIONS
    const fetchUserTotalPlaylists = async () => {

        const url = `${SPOTIFY_API_BASE_URL}/v1/users/${USER_ID}/playlists`;

        const method = 'GET';

        try {

            const { total } = await fetchSpotifyData({ url, method, token });

            return total;

        } catch (error) {

            throw error;

        };

    }; //!FUNC-FETCHUSERTOTALPLAYLISTS

    const fetchUserRandomPlaylist = async (randomOffset) => {

        const url = `${SPOTIFY_API_BASE_URL}/v1/users/${USER_ID}/playlists?limit=1&offset=${randomOffset}`;

        const method = 'GET';

        try {

            const { items: [{ id: playlist_id, tracks: { total: total_tracks } }] } = await fetchSpotifyData({ url, method, token });

            return { playlist_id, total_tracks };

        } catch (error) {

            throw error;

        };

    }; //!FUNC-FETCHUSERRANDOMPLAYLIST

    const checkIsPlaylistFollowed = async (playlist_id) => {

        const url = `${SPOTIFY_API_BASE_URL}/v1/playlists/${playlist_id}/followers/contains?ids=${user.id}`;

        const method = 'GET';

        try {

            const [response] = await fetchSpotifyData({ url, method, token });

            return response;

        } catch (error) {

            throw error;

        };

    }; //!FUNC-CHECKISPLAYLISTFOLLOWED

    const getRandomPlaylist = async () => {

        try {

            dispatch(setStatus(STATUS.LOADING));

            const total = await fetchUserTotalPlaylists();

            const randomOffset = generateRandomNumber(total);

            const { playlist_id, total_tracks } = await fetchUserRandomPlaylist(randomOffset);

            const isFollowed = await checkIsPlaylistFollowed(playlist_id);

            const payload = { playlist_id, total_tracks, isFollowed };

            dispatch(setPlaylist(payload));

        } catch (error) {

            console.error(`Error: ${error.message}`);

            dispatch(setStatus(STATUS.FAILED));

        };

    }; //!FUNC-GETRANDOMPLAYLIST

    /**
     * Adds (follow) or removes (unfollow) the current user as a follower of a playlist.
     * @async
     * @function handleFollow
     */
    const handleFollow = async (playlist) => {

        /**
         * @type {Object}
         * @prop {String} playlist_id - The Spotify ID of the playlist.
         * @prop {Boolean} isFollowed - Indicates whether the user follows the playlist with the provided ID.
         */
        const { playlist_id, isFollowed } = playlist;

        /**
         * The URL for the follow/unfollow playlist Spotify API endpoint.
         * @type {String}
         */
        const url = `${SPOTIFY_API_BASE_URL}/v1/playlists/${playlist_id}/followers`;

        /**
         * The HTTP method to be used for the Spotify API request, based on the 'isFollowed' property.
         * @type {String}
         */
        const method = isFollowed ? 'DELETE' : 'PUT';

        try {

            await fetchSpotifyData({ url, method, token });

            /**
             * The reducer works as a toggle for the playlist follow status.
             * @param {Boolean} isFollowed - The current follow status of the playlist.
             * @returns {Boolean} The new follow status after toggling.
             */
            const payload = isFollowed ? false : true;

            dispatch(isPlaylistFollowed(payload));

        } catch (error) {

            console.error(`Error: ${error.message}`);

            //TODO: handle error to show an alert.

        };

    }; //!FUNC-HANDLEFOLLOW


    return { getRandomPlaylist, handleFollow };

};