import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateRandomNumber } from '../helpers';
import { setPlaylist, setPlaylistUndone, setStatus } from '../store/slices';
import { SPOTIFY_BASE_URL, STATUS, USER_ID } from "../utils";

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

        const url = `${SPOTIFY_BASE_URL}/v1/users/${USER_ID}/playlists`;

        try {

            const response = await fetch(url, fetchOptions);

            if (!response.ok) throw new Error("Failed to obtain user's playlists");

            else return await response.json();

        } catch (error) {

            throw error;

        };

    };

    const fetchRandomUserPlaylist = async (randomOffset) => {

        const url = `${SPOTIFY_BASE_URL}/v1/users/${USER_ID}/playlists?limit=1&offset=${randomOffset}`;

        try {

            const response = await fetch(url, fetchOptions);

            if (!response.ok) throw new Error("Failed to obtain user's random playlist");

            else return await response.json();

        } catch (error) {

            throw error;

        };

    };

    const checkIsPlaylistFollowed = async (playlistId) => {

        const url = `${SPOTIFY_BASE_URL}/v1/playlists/${playlistId}/followers/contains?ids=${user.id}`;

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

            const { items: [{ id: playlist_id, tracks: { total: total_tracks } }] } = await fetchRandomUserPlaylist(randomOffset);

            const [isFollowed] = await checkIsPlaylistFollowed(playlist_id);

            dispatch(setPlaylist({ playlist_id, total_tracks, isFollowed }));

        } catch (error) {

            console.error(error);

            dispatch(setStatus(STATUS.FAILED));

        };

    };

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


    return { playlist, getRandomPlaylist };

};