import { useDispatch } from "react-redux";
import { useCookies } from 'react-cookie';
import { setUser, startUserLoading } from "../store/slices";
import { SPOTIFY_BASE_URL } from '../utils';

export const useUserStore = () => {

    // REACT-REDUX HOOK
    const dispatch = useDispatch();

    // REACT-COOKIE HOOK
    const [cookies] = useCookies([]);

    // FUNCTIONS
    const getUserProfile = async () => {

        dispatch(startUserLoading());

        const token = cookies.access_token;

        const fetchOptions = { headers: { Authorization: `Bearer ${token}` } };

        try {

            const response = await fetch(`${SPOTIFY_BASE_URL}/v1/me`, fetchOptions);

            if (response.ok) {

                const { id, display_name, images } = await response.json();

                dispatch(setUser({ id, display_name, images }));

            };

        } catch (error) {

            console.error(error.message);

        };

    };


    return { getUserProfile };

};