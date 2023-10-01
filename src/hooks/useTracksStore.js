import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
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
    const getUserPlaylists = async () => {

        try {

            const response = await fetch(`${SPOTIFY_BASE_URL}/v1/users/${USER_ID}/playlists`, fetchOptions);

            if (!response.ok) {

                throw new Error("Failed to obtain user's playlists");

            };

            const data = await response.json();

            console.log(data);

        } catch (error) {

            throw error;

        };

    };

    const init = () => {

        try {

            dispatch(startTrackLoading());

            getUserPlaylists();

        } catch (error) {

            console.error(error);

            dispatch(setTrackError());

        };

    };


    return { init };

};