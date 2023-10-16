import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateRandomNumber } from "../helpers";
import { setStatus, setTrack } from '../store/slices';
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
    const fetchPlaylistItemsById = async (playlistId, randomOffset) => {

        const url = `${SPOTIFY_BASE_URL}/v1/playlists/${playlistId}/tracks?limit=1&offset=${randomOffset}`;

        try {

            const response = await fetch(url, fetchOptions);

            if (!response.ok) throw new Error('Failed to obtain playlist items');

            else return response.json();

        } catch (error) {

            throw error;

        };

    };

    const checkIsTrackLiked = async (trackId) => {

        const url = `${SPOTIFY_BASE_URL}/v1/me/tracks/contains?ids=${trackId}`;

        try {

            const response = await fetch(url, fetchOptions);

            if (!response.ok) throw new Error('Failed to check if user has already liked the track');

            else return await response.json();

        } catch (error) {

            throw error;

        };

    };

    const getRandomTrack = async (playlistId, totalTracks) => {

        try {

            const randomOffset = generateRandomNumber(totalTracks);

            const { items: [{ track: { id: track_id, album: { images: [{ url: album_cover }] }, name, artists, preview_url } }] } = await fetchPlaylistItemsById(playlistId, randomOffset);

            const [isLiked] = await checkIsTrackLiked(track_id);

            dispatch(setTrack({ track_id, album_cover, name, artists, preview_url, isLiked }));

            dispatch(setStatus(STATUS.SUCCEEDED));

        } catch (error) {

            console.error(error);

            dispatch(setStatus(STATUS.FAILED));

        };

    };

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


    return { track };

};