import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Track } from '../components';
import { useAuth } from '../hooks';
import { NavBar } from '../layouts';
import { ACCESS_TOKEN_KEY, STATE_KEY } from '../utils';

export const HomePage = () => {

    // REACT-COOKIE HOOK
    const [cookies, setCookie, removeCookie] = useCookies([ACCESS_TOKEN_KEY]); // Dependencies: cookie names that the component depend on or that should trigger a re-render

    // CUSTOM HOOKS
    const { requestRefreshedAccessToken } = useAuth();

    // REACT HOOKS
    useEffect(() => {

        // Removes the cookie after login
        if (cookies.spotify_auth_state) removeCookie(STATE_KEY);

        // Token is expired
        if (!cookies.access_token) requestRefreshedAccessToken(cookies.refresh_token);

    }, [cookies]); // It triggers every time the cookie with 'access_token' key expires


    return (

        <>

            <NavBar />

            <Track />

        </>

    );

};