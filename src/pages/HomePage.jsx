import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useAuth, useTracksStore } from '../hooks';
import { NavBar } from '../layouts/NavBar';
import { ACCESS_TOKEN_KEY, STATE_KEY } from '../utils';

export const HomePage = () => {

    // REACT-REDUX HOOK
    const { tracks } = useSelector(state => state.tracks);

    // REACT-COOKIE HOOK
    const [cookies, setCookie, removeCookie] = useCookies([ACCESS_TOKEN_KEY]); // Dependencies (optional): cookie name that the component depend on or that should trigger a re-render

    // CUSTOM HOOKS
    const { requestRefreshedAccessToken } = useAuth();

    const { getRandomTrackFromSpotifyPlaylists } = useTracksStore();

    // REACT HOOKS
    useEffect(() => {

        if(cookies.spotify_auth_state) removeCookie(STATE_KEY);

    }, []);

    useEffect(() => {

        // Token is expired
        if (!cookies.access_token) {

            requestRefreshedAccessToken(cookies.refresh_token);

        } else {

            // First, it checks if the 'tracks' property of the state is empty to prevent unnecessary re-renders
            if (tracks.length === 0) getRandomTrackFromSpotifyPlaylists();

        };

    }, [cookies]); // It triggers every time the cookie with 'access_token' key expires


    return (

        <>

            <NavBar />

        </>

    );

};