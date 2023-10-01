import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useAuth, useUserStore } from '../hooks';
import { ACCESS_TOKEN_KEY } from '../utils';

export const HomePage = () => {

    // REACT-REDUX HOOK
    const { user } = useSelector(state => state.user);

    // REACT-COOKIE HOOK
    const [cookies] = useCookies([ACCESS_TOKEN_KEY]); // Dependencies (optional): cookie name that the component depend on or that should trigger a re-render

    // CUSTOM HOOKS
    const { handleLogout, requestRefreshedAccessToken } = useAuth();

    const { getUserProfile } = useUserStore();

    // REACT HOOK
    useEffect(() => {

        // Token is expired
        if (!cookies.access_token) {

            requestRefreshedAccessToken(cookies.refresh_token);

        } else {

            //TODO: an init function with 'getUserProfile' and the core feature (getUserPlaylists, getPlaylistItems…)

            // State 'user' is empty
            if (Object.keys(user).length === 0) getUserProfile();

        };

    }, [cookies]); // It triggers every time the cookie with 'access_token' key expires


    return (

        <>

            <button onClick={handleLogout}>Logout</button>

            <h2>Welcome, {user?.display_name}!</h2>

            <img src={user.images?.[1].url} alt='User avatar' title='User avatar' />

        </>

    );

};