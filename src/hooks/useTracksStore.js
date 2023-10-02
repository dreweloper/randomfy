import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { generateRandomNumber } from '../helpers';
import { addTrack, setTrackError, startTrackLoading } from '../store/slices';
import { ACCESS_TOKEN_KEY, SPOTIFY_BASE_URL, USER_ID } from '../utils';

export const useTracksStore = () => {

    // REACT-REDUX HOOKS
    const dispatch = useDispatch();

    // REACT-COOKIE HOOK
    const [cookies] = useCookies([ACCESS_TOKEN_KEY]);

    // VARIABLES
    const fetchOptions = { headers: { Authorization: `Bearer ${cookies.access_token}` } };

    // FUNCTIONS
    const getUserTotalPlaylists = async () => {

        try {

            const response = await fetch(`${SPOTIFY_BASE_URL}/v1/users/${USER_ID}/playlists`, fetchOptions);

            if (!response.ok) {

                throw new Error("Failed to obtain user's playlists");

            };

            const { total } = await response.json();

            return total;

        } catch (error) {

            throw error;

        };

    };

    const getRandomUserPlaylistId = async (total) => {

        try {

            const randomOffset = generateRandomNumber(total);

            const response = await fetch(`${SPOTIFY_BASE_URL}/v1/users/${USER_ID}/playlists?limit=1&offset=${randomOffset}`, fetchOptions);

            if (!response.ok) {

                throw new Error("Failed to obtain random user's playlist");

            } else {

                const data = await response.json();

                return data.items[0].id;

            };

        } catch (error) {

            throw error;

        };

    };

    const init = async () => {

        try {

            dispatch(startTrackLoading());

            const total = await getUserTotalPlaylists();

            const playlist_id = await getRandomUserPlaylistId(total);

        } catch (error) {

            console.error(error.message);

            dispatch(setTrackError());

        };

    };


    return { init };

};