import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateRandomNumber } from '../helpers';
import { isPlaylistDone, setPlaylist, setStatus } from '../store/slices';
import { SPOTIFY_BASE_URL, STATUS, USER_ID } from "../utils";

export const usePlaylistStore = (token) => {

    // REACT-REDUX HOOKS
    const playlist = useSelector(state => state.playlist);

    const dispatch = useDispatch();

    // VARIABLES
    const fetchOptions = { headers: { Authorization: `Bearer ${token}` } };

    // FUNCTIONS
    const getRandomPlaylist = async () => {

        let url, response;

        try {
            
            dispatch(setStatus(STATUS.LOADING));

            // Reset the state so that the 'getRandomTrack' useEffect triggers after the 'getRandomPlaylist' process has completed ('isDone')
            if (playlist.isDone) dispatch(isPlaylistDone(false));

            url = `${SPOTIFY_BASE_URL}/v1/users/${USER_ID}/playlists`;

            response = await fetch(url, fetchOptions);

            if (!response.ok) {

                throw new Error("Failed to obtain user's playlists");

            };

            const { total } = await response.json();

            const randomOffset = generateRandomNumber(total);

            url = `${SPOTIFY_BASE_URL}/v1/users/${USER_ID}/playlists?limit=1&offset=${randomOffset}`;

            response = await fetch(url, fetchOptions);

            if (!response.ok) {

                throw new Error("Failed to obtain user's random playlist");

            };

            const { items: [{ id, tracks }] } = await response.json();

            const payload = { playlist_id: id, total_tracks: tracks.total };

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