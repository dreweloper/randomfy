import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSpotifyData } from "../api";
import { generateRandomNumber } from '../helpers';
import { isPlaylistFollowed, setPlaylist, setStatus } from '../store/slices';
import { SPOTIFY_API_BASE_URL, STATUS, USER_ID } from "../utils";

export const usePlaylistStore = ({ playlist, status, token, user }) => {

    // REACT-REDUX HOOK
    const dispatch = useDispatch();

    // FUNCTIONS
    const fetchUserTotalPlaylists = async () => {

        const url = `${SPOTIFY_API_BASE_URL}/v1/users/${USER_ID}/playlists`;

        const method = 'GET';

        try {

            const response = await fetchSpotifyData({ url, method, token });

            const { total } = response;

            return total;

        } catch (error) {

            throw error;

        };

    }; //!FUNC-FETCHUSERTOTALPLAYLISTS

    const fetchUserRandomPlaylist = async (randomOffset) => {

        const url = `${SPOTIFY_API_BASE_URL}/v1/users/${USER_ID}/playlists?limit=1&offset=${randomOffset}`;

        const method = 'GET';

        try {

            const response = await fetchSpotifyData({ url, method, token });

            const { items: [{ id: playlist_id, tracks: { total: total_tracks } }] } = response;

            return { playlist_id, total_tracks };

        } catch (error) {

            throw error;

        };

    }; //!FUNC-FETCHUSERRANDOMPLAYLIST

    const checkIsPlaylistFollowed = async (playlistId) => {

        const url = `${SPOTIFY_API_BASE_URL}/v1/playlists/${playlistId}/followers/contains?ids=${user.id}`;

        const method = 'GET';

        try {

            const response = await fetchSpotifyData({ url, method, token });

            // Array destructuring.
            const [isFollowed] = response;

            return isFollowed;

        } catch (error) {

            throw error;

        };

    }; //!FUNC-CHECKISPLAYLISTFOLLOWED

    const getRandomPlaylist = async () => {

        try {

            // After init, when the user clicks the 'random track' button, the 'status' state will be set to 'loading' before this function is triggered.
            if (status !== STATUS.LOADING) dispatch(setStatus(STATUS.LOADING));

            const total = await fetchUserTotalPlaylists();

            const randomOffset = generateRandomNumber(total);

            const playlist = await fetchUserRandomPlaylist(randomOffset);

            const { playlist_id, total_tracks } = playlist;

            const isFollowed = await checkIsPlaylistFollowed(playlist_id);

            const payload = { playlist_id, total_tracks, isFollowed };

            dispatch(setPlaylist(payload));

        } catch (error) {

            console.error(error);

            dispatch(setStatus(STATUS.FAILED));

        };

    }; //!FUNC-GETRANDOMPLAYLIST

    /**
     * Adds (follow) or removes (unfollow) the current user as a follower of a playlist.
     * @async
     * @function handleFollow
     */
    const handleFollow = async () => {

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

            console.error(error);

            //TODO: handle error to show an alert.

        };

    }; //!FUNC-HANDLEFOLLOW

    useEffect(() => {

        /**
         * If the token is expired during the initial page load, the user data will be empty.
         * Once the token is refreshed, the user profile will be set, and this useEffect will be triggered again due to the 'user' dependency.
         * From there, the useEffect will trigger every time the user clicks the 'Random track' button that modifies the 'isDone' prop of the 'playlist' state.
         */
        if (!user.isEmpty && !playlist.isDone) getRandomPlaylist();

    }, [user, playlist]);


    return { handleFollow };

};