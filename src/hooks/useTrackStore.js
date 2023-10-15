import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateRandomNumber } from "../helpers";
import { setStatus, setTrack } from '../store/slices';
import { SPOTIFY_BASE_URL, STATUS } from "../utils";

export const useTrackStore = ({ playlist, status, token }) => {

    // VARIABLES
    const { playlist_id, total_tracks } = playlist;

    const fetchOptions = { headers: { Authorization: `Bearer ${token}` } };

    // REACT-REDUX HOOKS
    const { track } = useSelector(state => state.track);

    const dispatch = useDispatch();

    // FUNCTIONS
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

    const getRandomTrack = async () => {

        try {

            const randomOffset = generateRandomNumber(total_tracks);

            const url = `${SPOTIFY_BASE_URL}/v1/playlists/${playlist_id}/tracks?limit=1&offset=${randomOffset}`;

            const response = await fetch(url, fetchOptions);

            if (!response.ok) {

                throw new Error('Failed to obtain random track');

            };

            const { items: [{ track: { id: track_id, album: { images: [{ url: artwork }] }, name, artists, preview_url } }] } = await response.json();

            const [isLiked] = await checkIsTrackLiked(track_id);

            const payload = {
                track: {
                    track_id,
                    artwork,
                    name,
                    artists: artists.map(artist => artist.name), // There can be more than one artist
                    preview_url,
                },
                isLiked
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