import { useDispatch, useSelector } from "react-redux";
import { fetchSpotifyData } from "../api";
import { generateRandomNumber } from '../helpers';
import { isPlaylistFollowed, setPlaylist } from '../store/slices';
import { SPOTIFY_API_BASE_URL, USER_ID } from "../utils";

export const usePlaylistStore = () => {

    // REACT-REDUX HOOKS
    const playlist = useSelector(state => state.playlist);

    const dispatch = useDispatch();

    // FUNCTIONS
    const fetchUserTotalPlaylists = async (token) => {

        const url = `${SPOTIFY_API_BASE_URL}/v1/users/${USER_ID}/playlists`;

        const method = 'GET';

        try {

            const response = await fetchSpotifyData({ url, method, token });

            if (response?.ok) {

                const { total } = response.data;

                return { ok: true, total };

            };

        } catch (error) {

            throw error;

        };

    }; //!FUNC-FETCHUSERTOTALPLAYLISTS

    const fetchUserRandomPlaylist = async (token, randomOffset) => {

        const url = `${SPOTIFY_API_BASE_URL}/v1/users/${USER_ID}/playlists?limit=1&offset=${randomOffset}`;

        const method = 'GET';

        try {

            const response = await fetchSpotifyData({ url, method, token });

            if (response?.ok) {

                const { items: [{ id: playlist_id, tracks: { total: total_tracks } }] } = response.data;

                return { ok: true, playlist_id, total_tracks };

            };

        } catch (error) {

            throw error;

        };

    }; //!FUNC-FETCHUSERRANDOMPLAYLIST

    const checkIsPlaylistFollowed = async (token, playlistId, userId) => {

        const url = `${SPOTIFY_API_BASE_URL}/v1/playlists/${playlistId}/followers/contains?ids=${userId}`;

        const method = 'GET';

        try {

            const response = await fetchSpotifyData({ url, method, token });

            if (response?.ok) {

                // Array destructuring.
                const [isFollowed] = response.data;

                return { ok: true, isFollowed };

            };

        } catch (error) {

            throw error;

        };

    }; //!FUNC-CHECKISPLAYLISTFOLLOWED

    const getRandomPlaylist = async (token, userId) => {

        let response;

        try {

            response = await fetchUserTotalPlaylists(token);

            if (response?.ok) {

                const randomOffset = generateRandomNumber(response.total);

                response = await fetchUserRandomPlaylist(token, randomOffset);

                if (response?.ok) {

                    const { playlist_id, total_tracks } = response;

                    response = await checkIsPlaylistFollowed(token, playlist_id, userId);

                    if (response?.ok) {

                        const { isFollowed } = response;

                        const payload = { playlist_id, total_tracks, isFollowed };

                        dispatch(setPlaylist(payload));

                        return {
                            ok: true,
                            playlistId: playlist_id,
                            totalTracks: total_tracks
                        };

                    };
                };
            };

        } catch (error) {

            throw error;

        };

    }; //!FUNC-GETRANDOMPLAYLIST

    /**
     * Adds (follow) or removes (unfollow) the current user as a follower of a playlist.
     * @async
     * @function handleFollow
     */
    const handleFollow = async (token) => {

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

            /**
             * After the dispatch, the 'isFollowed' prop in the state switches to its opposite value.
             * Consequently, the text reflects the opposite of the current state of the 'isFollowed' prop.
             */
            const text = !isFollowed ? 'Playlist added to Your Library.' : 'Playlist removed from Your Library.';

            return {
                ok: true,
                text
            };

        } catch (error) {

            throw error;

        };

    }; //!FUNC-HANDLEFOLLOW


    return { getRandomPlaylist, handleFollow };

};