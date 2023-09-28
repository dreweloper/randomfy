import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useUserStore } from '../hooks';
import { deleteUser } from '../store/slices';

export const HomePage = () => {

    // REACT-REDUX HOOKS
    const { user, isUserLoading } = useSelector(state => state.user);

    const dispatch = useDispatch();

    // REACT-COOKIE HOOK
    const [cookies, setCookie, removeCookie] = useCookies([]);

    // CUSTOM HOOK
    const { getUserProfile } = useUserStore();

    // REACT HOOK
    useEffect(() => {

        getUserProfile();

    }, []);

    // FUNCTION
    const handleLogout = () => {

        removeCookie('access_token');

        removeCookie('refresh_token');

        dispatch(deleteUser());

    };

    if (isUserLoading) {

        return <p>Loading…</p>

    };


    return (

        <>

            <button onClick={handleLogout}>Logout</button>

            <h2>¡Bienvenido, {user?.display_name}!</h2>

            <img src={user.images?.[1].url} alt='User avatar' title='User avatar' />

        </>

    );

};