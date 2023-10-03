import { useDispatch } from "react-redux";
import { useCookies } from 'react-cookie';
import { setError, setUser, startUserLoading } from "../store/slices";
import { ACCESS_TOKEN_KEY, SPOTIFY_BASE_URL } from '../utils';

export const useUserStore = () => {

    // REACT-REDUX HOOK
    const dispatch = useDispatch();

    // REACT-COOKIE HOOK
    const [cookies] = useCookies([ACCESS_TOKEN_KEY]);

    // FUNCTIONS
    const getUserProfile = async () => {

        const fetchOptions = { headers: { Authorization: `Bearer ${cookies.access_token}` } };

        try {

            dispatch(startUserLoading());

            const response = await fetch(`${SPOTIFY_BASE_URL}/v1/me`, fetchOptions);

            if (!response.ok) {

                throw new Error("Failed to obtain user's profile");

            } else {

                const { id, display_name, images } = await response.json();

                dispatch(setUser({ id, display_name, images }));

            };

        } catch (error) {

            console.error(error.message);

            dispatch(setError());

        };

    };


    return { getUserProfile };

};