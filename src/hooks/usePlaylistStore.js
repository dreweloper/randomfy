import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateRandomNumber } from '../helpers';
import { isPlaylistFollowed, setPlaylist, setPlaylistUndone, setStatus } from '../store/slices';
import { SPOTIFY_API_BASE_URL, STATUS, USER_ID } from "../utils";

export const usePlaylistStore = (token) => {

    // REACT-REDUX HOOKS
    const { playlist, user } = useSelector(state => state);

    const dispatch = useDispatch();

    // VARIABLES
    /**
     * Options for making authenticated requests to the Spotify API using the Fetch API.
     * @type {Object}
     * @prop {Object} headers - Headers for the request.
     * @prop {String} headers.Authorization - The Authorization header with a bearer token.
     */
    const fetchOptions = { headers: { Authorization: `Bearer ${token}` } };

    // FUNCTIONS
    const fetchUserTotalPlaylists = async () => {

        const url = `${SPOTIFY_API_BASE_URL}/v1/users/${USER_ID}/playlists`;

        try {

            const response = await fetch(url, fetchOptions);

            if (!response.ok) throw new Error("Failed to obtain user's playlists");

            else return await response.json();

        } catch (error) {

            throw error;

        };

    };

    const fetchUserRandomPlaylist = async (randomOffset) => {

        const url = `${SPOTIFY_API_BASE_URL}/v1/users/${USER_ID}/playlists?limit=1&offset=${randomOffset}`;

        try {

            const response = await fetch(url, fetchOptions);

            if (!response.ok) throw new Error("Failed to obtain user's random playlist");

            else return await response.json();

        } catch (error) {

            throw error;

        };

    };

    const checkIsPlaylistFollowed = async (playlistId) => {

        const url = `${SPOTIFY_API_BASE_URL}/v1/playlists/${playlistId}/followers/contains?ids=${user.id}`;

        try {

            const response = await fetch(url, fetchOptions);

            if (!response.ok) throw new Error('Failed to check if user follows the playlist');

            else return await response.json();

        } catch (error) {

            throw error;

        };

    };

    const getRandomPlaylist = async () => {

        try {

            dispatch(setStatus(STATUS.LOADING));

            // Reset the state so that the 'getRandomTrack' useEffect triggers after the 'getRandomPlaylist' process has completed ('isDone').
            if (playlist.isDone) dispatch(setPlaylistUndone());

            const { total } = await fetchUserTotalPlaylists();

            const randomOffset = generateRandomNumber(total);

            const { items: [{ id: playlist_id, tracks: { total: total_tracks } }] } = await fetchUserRandomPlaylist(randomOffset);

            const [isFollowed] = await checkIsPlaylistFollowed(playlist_id);

            dispatch(setPlaylist({ playlist_id, total_tracks, isFollowed }));

        } catch (error) {

            console.error(error);

            dispatch(setStatus(STATUS.FAILED));

        };

    };

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

        /**
         * Fetch options for making a request to the Spotify API.
         * @type {Object}
         * @property {String} method - The HTTP method for the request.
         * @property {Object} headers - Headers for the request, including 'Authorization' and 'Content-Type'.
         */
        const options = {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        try {

            /**
             * The Spotify API response object.
             * @type {Object}
             */
            const response = await fetch(url, options);

            if (!response.ok) {

                throw new Error('Failed to add/remove the user as a follower of the playlist');

            };

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
         * Indicates whether the 'user' state is not empty, based on the length of its 'id' property.
         * @type {Boolean}
         */
        const userIsNotEmpty = user.id.length > 0;

        /**
         * This 'useEffect' should only be triggered during the initial loading of the 'playlist' state.
         * First condition: it will trigger for the first time, i.e., when the 'initialState' has not been modified.
         * Second condition: it allows the 'user' state to load first, preventing errors in 'checkIsPlaylistFollowed' which depends on 'user.id'.
         * Additionally, it prevents unnecessary re-renders when navigating with web browser arrows.
         */
        if (!playlist.isDone && userIsNotEmpty) getRandomPlaylist();

    }, [user]); // It will trigger once more after the initial component mount when the user is loaded.


    return {
        playlist,
        getRandomPlaylist,
        handleFollow
    };

};