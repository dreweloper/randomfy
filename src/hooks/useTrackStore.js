import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateRandomNumber } from "../helpers";
import { setStatus, setTrack } from '../store/slices';
import { SPOTIFY_BASE_URL, STATUS } from "../utils";

export const useTrackStore = ({ token, playlist, status }) => {

    // REACT-REDUX HOOKS
    const { track } = useSelector(state => state.track);

    const dispatch = useDispatch();

    // VARIABLES
    const { playlist_id, total_tracks } = playlist;

    const fetchOptions = { headers: { Authorization: `Bearer ${token}` } };

    // FUNCTIONS
    const getRandomTrack = async () => {

        try {

            const randomOffset = generateRandomNumber(total_tracks);

            const url = `${SPOTIFY_BASE_URL}/v1/playlists/${playlist_id}/tracks?limit=1&offset=${randomOffset}`;

            const response = await fetch(url, fetchOptions);

            if (!response.ok) {

                throw new Error('Failed to obtain random track');

            };

            const { items: [{ track: { id, album, name, artists, preview_url } }] } = await response.json();

            const payload = {
                track_id: id,
                artwork: album.images[0].url,
                name,
                artists: artists.map(artist => artist.name), // There can be more than one artist
                preview_url
            };

            dispatch(setTrack(payload));

            dispatch(setStatus(STATUS.SUCCEEDED));

        } catch (error) {

            console.error(error);

            dispatch(setStatus(STATUS.FAILED));

        };

    };

    useEffect(() => {

        // The second conditional avoids unnecessary re-renders (e.g., during navigation with web browser arrows)
        if (playlist.isDone && status === STATUS.LOADING) getRandomTrack();

    }, [playlist]);


    return { track };

};