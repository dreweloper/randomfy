import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateRandomNumber } from "../helpers";
import { isTrackLiked, setStatus, setTrack } from '../store/slices';
import { SPOTIFY_BASE_URL, STATUS } from "../utils";

export const useTrackStore = (token) => {

    // REACT-REDUX HOOKS
    const { playlist, process: { status }, track } = useSelector(state => state);

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
    /**
     * Get full details of the items of a playlist owned by a Spotify user.
     * @async
     * @function fetchPlaylistItemsById
     * @param {String} id - The Spotify ID of the playlist.
     * @param {Number} offset - A random offset for selecting a playlist.
     * @returns {Promise<Object>} A promise that resolves to an object containing details of the playlist items.
     * @throws {Error} Throws an error if it fails to obtain the playlist items.
     */
    const fetchPlaylistItemsById = async (id, offset) => {

        /**
         * The URL for the get playlist items Spotify API endpoint.
         * @type {String}
         */
        const url = `${SPOTIFY_BASE_URL}/v1/playlists/${id}/tracks?limit=1&offset=${offset}`;

        try {

            /**
             * The Spotify API response object.
             * @type {Object}
             */
            const response = await fetch(url, fetchOptions);

            if (!response.ok) throw new Error('Failed to obtain playlist items');

            else return await response.json();

        } catch (error) {

            throw error;

        };

    }; //!FUNC-FETCHPLAYLISTITEMSBYID

    /**
     * Check if the track is already saved in the current Spotify user's 'Your Music' library.
     * @async
     * @function checkIsTrackLiked
     * @param {String} id - The Spotify ID of the track.
     * @returns {Promise<Object>} A promise that resolves to an object representing the result of the check.
     * @throws {Error} Throws an error if it fails to check if user has already saved the track.
     */
    const checkIsTrackLiked = async (id) => {

        /**
         * The URL for the check user's saved tracks Spotify API endpoint.
         * @type {String}
         */
        const url = `${SPOTIFY_BASE_URL}/v1/me/tracks/contains?ids=${id}`;

        try {

            /**
             * The Spotify API response object.
             * @type {Object}
             */
            const response = await fetch(url, fetchOptions);

            if (!response.ok) throw new Error('Failed to check if user has already saved the track');

            else return await response.json();

        } catch (error) {

            throw error;

        };

    }; //!FUNC-CHECKISTRACKLIKED

    /**
     * Retrieves a random track from a random playlist.
     * @async
     * @function getRandomTrack
     * @param {String} id - The Spotify ID of the playlist.
     * @param {Number} total - The total number of tracks in the playlist with the provided ID.
     */
    const getRandomTrack = async (id, total) => {

        try {

            /**
             * Calculate a random offset for selecting an item (track object).
             * @type {Number}
             */
            const randomOffset = generateRandomNumber(total);

            const { items: [{ track: { id: track_id, album: { images: [{ url: album_cover }] }, name, artists, preview_url } }] } = await fetchPlaylistItemsById(id, randomOffset);

            /**
             * An array with destructured value indicating whether the track has already been added ('true') or not ('false') to the user's 'Your Music' library.
             * @type {Boolean}
             */
            const [isLiked] = await checkIsTrackLiked(track_id);

            dispatch(setTrack({ track_id, album_cover, name, artists, preview_url, isLiked }));

            dispatch(setStatus(STATUS.SUCCEEDED));

        } catch (error) {

            console.error(error);

            dispatch(setStatus(STATUS.FAILED));

        };

    }; //!FUNC-GETRANDOMTRACK

    /**
     * Save (like) or remove (dislike) tracks to/from the current user's 'Your Music' library.
     * @async
     * @function handleLike
     */
    const handleLike = async () => {

        /**
         * @type {Object}
         * @prop {String} track_id - The Spotify ID of the track.
         * @prop {Boolean} isLiked - Indicates whether the user liked the track with the provided ID.
         */
        const { track_id, isLiked } = track;

        /**
         * The URL for the save/remove track Spotify API endpoint.
         * @type {String}
         */
        const url = `${SPOTIFY_BASE_URL}/v1/me/tracks`;

        /**
         * The HTTP method to be used for the Spotify API request, based on the 'isLiked' property.
         * @type {String}
         */
        const method = isLiked ? 'DELETE' : 'PUT';

        /**
         * Fetch options for making a request to the Spotify API.
         * @type {Object}
         * @prop {String} method - The HTTP method for the request.
         * @prop {String} body - The request body data.
         * @prop {Object} headers - Headers for the request, including 'Authorization' and 'Content-Type'.
         */
        const options = {
            method,
            body: JSON.stringify({ ids: [track_id] }),
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

                throw new Error("Failed to save/remove track to/from the current user's 'Your Music' library.");

            };

            /**
             * The reducer works as a toggle for the track like status.
             * @param {Boolean} isLiked - The current like status of the track.
             * @returns {Boolean} The new like status after toggling.
             */
            const payload = isLiked ? false : true;

            dispatch(isTrackLiked(payload));

        } catch (error) {

            console.log(error);

            //TODO: handle error to show an alert.

        };

    }; //!FUNC-HANDLELIKE

    // REACT HOOK
    useEffect(() => {

        /**
         * @type {Object}
         * @prop {String} playlist_id - The Spotify ID of the playlist.
         * @prop {Number} total_tracks - The total number of tracks in the playlist with the provided ID.
         */
        const { playlist_id, total_tracks } = playlist;

        /**
         * First condition: 'getRandomPlaylist' succeeds.
         * Second condition: prevents unnecessary re-renders when navigating with web browser arrows.
         */
        if (playlist.isDone && status === STATUS.LOADING) getRandomTrack(playlist_id, total_tracks);

    }, [playlist]);


    return {
        track,
        handleLike
    };

};