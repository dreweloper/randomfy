import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateRandomNumber } from '../helpers';
import { isPlaylistDone, setPlaylist, setStatus } from '../store/slices';
import { SPOTIFY_BASE_URL, STATUS, USER_ID } from "../utils";

export const usePlaylistStore = (props) => {

    // VARIABLES
    const { token, user } = props;

    const fetchOptions = { headers: { Authorization: `Bearer ${token}` } };

    // REACT-REDUX HOOKS
    const playlist = useSelector(state => state.playlist);

    const dispatch = useDispatch();

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

            // Reset the state so that the 'getRandomTrack' useEffect triggers after the 'getRandomPlaylist' process has completed ('isDone')
            if (playlist.isDone) dispatch(isPlaylistDone(false));

            const { total } = await fetchUserTotalPlaylists();

            const randomOffset = generateRandomNumber(total);

            const { items: [{ id: playlist_id, tracks: { total: total_tracks } }] } = await fetchRandomUserPlaylist(randomOffset);

            const [isFollowed] = await checkIsPlaylistFollowed(playlist_id);

            const payload = { playlist_id, total_tracks, isFollowed };

            dispatch(setPlaylist(payload));

        } catch (error) {

            console.error(error);

            dispatch(setStatus(STATUS.FAILED));

        };

    };

    useEffect(() => {

        // Avoids unnecessary re-renders (e.g., during navigation with web browser arrows)
        if (!playlist.isDone) getRandomPlaylist();

    }, []);


    return { playlist, getRandomPlaylist };

};