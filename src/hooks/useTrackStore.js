import { useDispatch, useSelector } from "react-redux";
import { fetchSpotifyData } from "../api";
import { generateRandomNumber, mapArtists } from "../helpers";
import { isTrackLiked, setTrack } from '../store/slices';
import { SPOTIFY_API_BASE_URL } from "../utils";

export const useTrackStore = () => {

    // REACT-REDUX HOOKS
    const track = useSelector(state => state.track);

    const dispatch = useDispatch();

    // FUNCTIONS
    /**
     * Get full details of the items of a playlist owned by a Spotify user.
     * @async
     * @function fetchPlaylistItemsById
     * @param {Number} randomOffset - A random offset for selecting a playlist.
     * @returns {Promise<Object>} A promise that resolves to an object containing details of the playlist items.
     * @throws {Error} Throws an error if it fails to obtain the playlist items.
     */
    const fetchPlaylistItemsById = async (token, playlistId, randomOffset) => {

        /**
         * The URL for the get playlist items Spotify API endpoint.
         * @type {String}
         */
        const url = `${SPOTIFY_API_BASE_URL}/v1/playlists/${playlistId}/tracks?limit=1&offset=${randomOffset}`;

        const method = 'GET';

        try {

            /**
             * The Spotify API response object.
             * @type {Object}
             */
            const response = await fetchSpotifyData({ url, method, token });

            if (response?.ok) {

                const { items } = response.data;

                if (items.length === 0) {

                    throw new Error('Playlist items are empty');

                };

                const [{ track: { id: track_id, album: { images: [{ url: artwork }], name: album }, name, artists: arrArtists, external_urls: { spotify: track_url }, preview_url } }] = items;

                /**
                 * The artists names.
                 * @type {String}
                 */
                const artists = mapArtists(arrArtists); // There can be more than one artist.

                return {
                    ok: true,
                    items: {
                        track_id,
                        artwork,
                        album,
                        name,
                        artists,
                        track_url,
                        preview_url
                    }
                };

            };

        } catch (error) {

            throw error;

        };

    }; //!FUNC-FETCHPLAYLISTITEMSBYID

    /**
     * Check if the track is already saved in the current Spotify user's 'Your Music' library.
     * @async
     * @function checkIsTrackLiked
     * @param {String} trackId - The Spotify ID of the track.
     * @returns {Promise<Object>} A promise that resolves to an object representing the result of the check.
     * @throws {Error} Throws an error if it fails to check if user has already saved the track.
     */
    const checkIsTrackLiked = async (token, trackId) => {

        /**
         * The URL for the check user's saved tracks Spotify API endpoint.
         * @type {String}
         */
        const url = `${SPOTIFY_API_BASE_URL}/v1/me/tracks/contains?ids=${trackId}`;

        const method = 'GET';

        try {

            const response = await fetchSpotifyData({ url, method, token });

            if (response?.ok) {

                // Array destructuring.
                const [isLiked] = response.data;

                return {
                    ok: true,
                    isLiked
                };

            };

        } catch (error) {

            throw error;

        };

    }; //!FUNC-CHECKISTRACKLIKED

    /**
     * Retrieves a random track from a random playlist.
     * 
     * @async
     * @function getRandomTrack
     */
    const getRandomTrack = async (token, playlistId, totalTracks) => {

        let response;

        try {

            /**
             * Calculate a random offset for selecting an item (track object).
             * @type {Number}
             */
            const randomOffset = generateRandomNumber(totalTracks);

            response = await fetchPlaylistItemsById(token, playlistId, randomOffset);

            if (response?.ok) {

                const { items } = response; // The 'fetchPlaylistItemsById' response.

                response = await checkIsTrackLiked(token, items.track_id);

                if (response?.ok) {

                    /**
                     * Value indicating whether the track has already been added ('true') or not ('false') to the user's 'Your Music' library.
                     * @type {Boolean}
                     */
                    const { isLiked } = response; // The 'checkIsTrackLiked' response.

                    const payload = { ...items, isLiked };

                    dispatch(setTrack(payload));

                    return { ok: true };

                };
            };

        } catch (error) {

            throw error;

        };

    }; //!FUNC-GETRANDOMTRACK

    /**
     * Save (like) or remove (dislike) tracks to/from the current user's 'Your Music' library.
     * 
     * @async
     * @function handleLike
     */
    const handleLike = async (token) => {

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

            /**
             * After the dispatch, the 'isLiked' prop in the state switches to its opposite value.
             * Consequently, the text reflects the opposite of the current state of the 'isLiked' prop.
             */
            const text = !isLiked ? 'Track added to Liked Songs.' : 'Track removed from Liked Songs.';

            return {
                ok: true,
                text
            }

        } catch (error) {

            throw error;

        };

    }; //!FUNC-HANDLELIKE


    return { getRandomTrack, handleLike };

};