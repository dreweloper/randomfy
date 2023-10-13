import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from "react-redux";
import { generateRandomNumber } from "../helpers";
import { setStatus, setTrack } from '../store/slices';
import { SPOTIFY_BASE_URL, STATUS } from "../utils";

export const useTrackStore = () => {

    // REACT-REDUX HOOKS
    const { playlist_id, total_tracks } = useSelector(state => state.playlist);

    const dispatch = useDispatch();

    // REACT-COOKIE
    const [cookies] = useCookies([]);

    // FUNCTIONS
    const getRandomTrack = async () => {

        const options = { headers: { Authorization: `Bearer ${cookies.access_token}` } };

        try {

            const randomOffset = generateRandomNumber(total_tracks);

            const url = `${SPOTIFY_BASE_URL}/v1/playlists/${playlist_id}/tracks?limit=1&offset=${randomOffset}`;

            const response = await fetch(url, options);

            if (!response.ok) {

                throw new Error('Failed to obtain random track');

            };

            const { items: [{ track }] } = await response.json();

            const payload = {
                track_id: track.id,
                artwork: track.album.images[0].url,
                name: track.name,
                artist: track.artists[0].name, //! could be more than one artist (filter or map)
                preview_url: track.preview_url,
            }

            dispatch(setTrack(payload));

            dispatch(setStatus(STATUS.SUCCEEDED));

        } catch (error) {

            console.error(error);

            dispatch(setStatus(STATUS.FAILED));

        };

    };


    return { getRandomTrack };

};