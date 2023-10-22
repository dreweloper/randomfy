import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotifyData } from "../api";
import { generateRandomNumber } from "../helpers";
import { isTrackLiked, setStatus, setTrack } from '../store/slices';
import { SPOTIFY_API_BASE_URL, STATUS } from "../utils";

export const useTrackStore = (token) => {

    // REACT-REDUX HOOKS
    const { playlist, process: { status }, track } = useSelector(state => state);

    const dispatch = useDispatch();

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
        const url = `${SPOTIFY_API_BASE_URL}/v1/playlists/${id}/tracks?limit=1&offset=${offset}`;

        const method = 'GET';

        try {

            /**
             * The Spotify API response object.
             * @type {Object}
             */
            const {
                items: [{
                    track: {
                        id: track_id,
                        album: {
                            images: [{
                                url: artwork
                            }]
                        },
                        name,
                        artists,
                        preview_url
                    }
                }]
            } = await fetchSpotifyData({ url, method, token });

            return { track_id, artwork, name, artists, preview_url };

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
        const url = `${SPOTIFY_API_BASE_URL}/v1/me/tracks/contains?ids=${id}`;

        const method = 'GET';

        try {

            const [response] = await fetchSpotifyData({ url, method, token });

            return response;

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

            const items = await fetchPlaylistItemsById(id, randomOffset);

            /**
             * Value indicating whether the track has already been added ('true') or not ('false') to the user's 'Your Music' library.
             * @type {Boolean}
             */
            const isLiked = await checkIsTrackLiked(items.track_id);

            const payload = { ...items, isLiked };

            dispatch(setTrack(payload));

            dispatch(setStatus(STATUS.SUCCEEDED));

        } catch (error) {

            console.error(`Error: ${error.message}`);

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
        const url = `${SPOTIFY_API_BASE_URL}/v1/me/tracks`;

        /**
         * The HTTP method to be used for the Spotify API request, based on the 'isLiked' property.
         * @type {String}
         */
        const method = isLiked ? 'DELETE' : 'PUT';

        const data = { ids: [track_id] };

        try {

            await fetchSpotifyData({ url, method, data, token });

            /**
             * The reducer works as a toggle for the track like status.
             * @param {Boolean} isLiked - The current like status of the track.
             * @returns {Boolean} The new like status after toggling.
             */
            const payload = isLiked ? false : true;

            dispatch(isTrackLiked(payload));

        } catch (error) {

            console.error(`Error: ${error.message}`);

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