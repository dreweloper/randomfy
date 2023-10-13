import { useCookies } from 'react-cookie';
import { useDispatch } from "react-redux";
import { generateRandomNumber } from '../helpers';
import { setPlaylist, setStatus } from '../store/slices';
import { SPOTIFY_BASE_URL, STATUS, USER_ID } from "../utils";

export const usePlaylistStore = () => {

    // REACT-REDUX HOOK
    const dispatch = useDispatch();

    // REACT-COOKIE HOOK
    const [cookies] = useCookies([]);

    const getRandomPlaylist = async () => {

        let url, response;

        const options = { headers: { Authorization: `Bearer ${cookies.access_token}` } };

        try {

            dispatch(setStatus(STATUS.LOADING));

            url = `${SPOTIFY_BASE_URL}/v1/users/${USER_ID}/playlists`;

            response = await fetch(url, options);

            if (!response.ok) {

                throw new Error("Failed to obtain user's playlists");

            };

            const { total } = await response.json();

            const randomOffset = generateRandomNumber(total);

            url = `${SPOTIFY_BASE_URL}/v1/users/${USER_ID}/playlists?limit=1&offset=${randomOffset}`;

            response = await fetch(url, options);

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


    return { getRandomPlaylist };

};