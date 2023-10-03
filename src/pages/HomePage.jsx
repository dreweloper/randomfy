import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useAuth, useTracksStore, useUserStore } from '../hooks';
import { ACCESS_TOKEN_KEY } from '../utils';

export const HomePage = () => {

    // REACT-REDUX HOOK
    const { user } = useSelector(state => state.user);

    const { tracks } = useSelector(state => state.tracks);

    // REACT-COOKIE HOOK
    const [cookies] = useCookies([ACCESS_TOKEN_KEY]); // Dependencies (optional): cookie name that the component depend on or that should trigger a re-render

    // CUSTOM HOOKS
    const { handleLogout, requestRefreshedAccessToken } = useAuth();

    const { getUserProfile } = useUserStore();

    const { getRandomTrackFromSpotifyPlaylists } = useTracksStore();

    // REACT HOOK
    useEffect(() => {

        // Token is expired
        if (!cookies.access_token) {

            requestRefreshedAccessToken(cookies.refresh_token);

        } else {

            //TODO: an init function with 'getUserProfile' and 'getRandomTrackFromSpotifyPlaylists'?

            // First, it checks if the 'user' property of the state is empty to prevent unnecessary re-renders
            if (Object.keys(user).length === 0) getUserProfile();

            // First, it checks if the 'tracks' property of the state is empty to prevent unnecessary re-renders
            if (tracks.length === 0) getRandomTrackFromSpotifyPlaylists();

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