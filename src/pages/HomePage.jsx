import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useAuth, useUserStore } from '../hooks';
import { ACCESS_TOKEN_KEY } from '../utils';

export const HomePage = () => {

    // REACT-REDUX HOOK
    const { user, isUserLoading } = useSelector(state => state.user);

    // REACT-COOKIE HOOK
    const [cookies] = useCookies([ACCESS_TOKEN_KEY]);

    // CUSTOM HOOKS
    const { handleLogout, requestRefreshedAccessToken } = useAuth();

    const { getUserProfile } = useUserStore();

    // REACT HOOK
    useEffect(() => {

        // Token is expired
        if (!cookies.access_token) {

            requestRefreshedAccessToken(cookies.refresh_token);

            // Token is valid and state 'user' is empty
        } else if (cookies.access_token && Object.keys(user).length === 0) {

            getUserProfile();

        };

    }, [cookies.access_token]); // It triggers every time the cookie expires


    if (isUserLoading) return <p>Loading…</p>


    return (

        <>

            <button onClick={handleLogout}>Logout</button>

            <h2>Welcome, {user?.display_name}!</h2>

            <img src={user.images?.[1].url} alt='User avatar' title='User avatar' />

        </>

    );

};