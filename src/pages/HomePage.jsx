import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton, Spinner, Toast, TrackCard } from '../components';
import { useAuth, usePlaylistStore, useTrackStore, useUserStore } from '../hooks';
import { Footer, NavBar } from '../layouts';
import { setPlaylistUndone } from '../store/slices';
import { ACCESS_TOKEN_KEY, CODE_VERIFIER_KEY, REFRESH_TOKEN_KEY, STATE_KEY, STATUS } from '../utils';

export const HomePage = () => {

    // REACT-COOKIE HOOK
    const [cookies, setCookie, removeCookie] = useCookies([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]); // Dependencies: cookie names that the component depend on or that should trigger a re-render.

    // REACT-REDUX HOOKS
    const { playlist, process: { status }, track, user } = useSelector(state => state);

    const dispatch = useDispatch();

    // VARIABLES
    /**
     * Access token for the Spotify Web API.
     * @type {String | undefined}
     */
    const token = cookies.access_token;

    /**
     * Information about a Spotify playlist.
     * @type {Object}
     * @prop {String} playlist_id - The Spotify ID of the playlist.
     * @prop {Number} total_tracks - The total number of tracks in the playlist with the provided ID.
     */
    const { playlist_id, total_tracks } = playlist;

    // CUSTOM HOOKS
    const { requestRefreshedAccessToken } = useAuth();

    const { getUserProfile } = useUserStore(token);

    const { getRandomPlaylist } = usePlaylistStore(token);

    const { getRandomTrack } = useTrackStore(token);

    // EVENT
    const handleAnotherShuffleTrack = () => dispatch(setPlaylistUndone()); // This action will trigger the second useEffect, restarting the process of obtaining a new random track.

    // REACT HOOKS
    //* Handles cookies and sets 'user' state.
    useEffect(() => {

        // Once the login is successful, the cookie will be removed.
        if (cookies.spotify_auth_state) removeCookie(STATE_KEY);

        // Once the login is successful, the cookie will be removed.
        if (cookies.code_verifier) removeCookie(CODE_VERIFIER_KEY);

        token ? user.isEmpty && getUserProfile() : requestRefreshedAccessToken();

    }, [cookies]); // When the token ('cookies.access_token') expires, it will be triggered again.

    //* Sets 'playlist' state.
    useEffect(() => {

        /**
         * If the token is expired during the initial page load, the user data will be empty.
         * Once the token is refreshed, the user profile will be set, and this useEffect will be triggered again due to the 'user' dependency.
         * From there, the useEffect will trigger every time the user clicks the 'RANDOM TRACK' button that modifies the 'isDone' prop of the 'playlist' state.
         */
        if (!user.isEmpty && !playlist.isDone) getRandomPlaylist(user.id);

    }, [user, playlist]);

    //* Sets 'track' state.
    useEffect(() => {

        /**
         * The conditions will both be met if 'getRandomPlaylist' succeeds.
         * This helps prevent unnecessary re-renders when navigating with web browser arrows.
         */
        if (playlist.isDone && status === STATUS.LOADING) getRandomTrack(playlist_id, total_tracks);

    }, [playlist]);


    return (

        <>

            <header>

                <NavBar />

            </header>

            <main className='main'>

                <section className='displayTrack'>

                    {/* CONTAINED BUTTON */}
                    <button
                        onClick={handleAnotherShuffleTrack}
                        disabled={user.isError || status === STATUS.LOADING}
                    >

                        {status === STATUS.LOADING ? (<Spinner />) : ('RANDOM TRACK')}

                    </button>

                    {
                        status === STATUS.LOADING || track.isEmpty ? (<Skeleton />) : (

                            <TrackCard {...{ playlist, token, track }} />

                        )
                    }

                    {
                        status === STATUS.FAILED && (

                            <Toast
                                type={'danger'}
                                text={"Oops! We couldn't load the track. Please try again."}
                            />

                        )
                    }

                </section>

            </main >

            <Footer />

        </>

    );

};