import { useDispatch } from "react-redux";
import { generateRandomNumber } from "../helpers";
import { setStatus, setTrack } from '../store/slices';
import { SPOTIFY_BASE_URL, STATUS } from "../utils";

export const useTrackStore = (token) => {

    // VARIABLES
    const fetchOptions = { headers: { Authorization: `Bearer ${token}` } };

    // REACT-REDUX HOOK
    const dispatch = useDispatch();

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
            } = await fetchPlaylistItemsById(playlistId, randomOffset);

            const [isLiked] = await checkIsTrackLiked(track_id);

            const track = {
                track_id,
                artwork,
                name,
                artists: artists.map(artist => artist.name), // There can be more than one artist
                preview_url,
            }

            const payload = { track, isLiked };

            dispatch(setTrack(payload));

            dispatch(setStatus(STATUS.SUCCEEDED));

        } catch (error) {

            console.error(error);

            dispatch(setStatus(STATUS.FAILED));

        };

    };


    return { getRandomTrack };

};