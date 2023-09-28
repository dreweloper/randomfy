import { useDispatch } from "react-redux";
import { useCookies } from 'react-cookie';
import { setUser, startUserLoading } from "../store/slices";
import { ACCESS_TOKEN_KEY, SPOTIFY_BASE_URL } from '../utils';

export const useUserStore = () => {

    // REACT-REDUX HOOK
    const dispatch = useDispatch();

    // REACT-COOKIE HOOK
    const [cookies] = useCookies([ACCESS_TOKEN_KEY]);

    // FUNCTIONS
    const getUserProfile = async () => {

        dispatch(startUserLoading());

        const fetchOptions = { headers: { Authorization: `Bearer ${cookies.access_token}` } };

        try {

            const response = await fetch(`${SPOTIFY_BASE_URL}/v1/me`, fetchOptions);

            if (response.ok) {

                const { id, display_name, images } = await response.json();

                dispatch(setUser({ id, display_name, images }));

            } else {

                throw new Error('Unexpected error');

            };

        } catch (error) {

            console.error(error.message);

            //TODO: handle error and rendering

        };

    };


    return { getUserProfile };

};