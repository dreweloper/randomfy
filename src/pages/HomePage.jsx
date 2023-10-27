import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { Skeleton, Spinner, Toast, TrackCard } from '../components';
import { usePlaylistStore, useTrackStore } from '../hooks';
import { Footer, NavBar } from '../layouts';
import { CODE_VERIFIER_KEY, STATE_KEY, STATUS } from '../utils';

export const HomePage = () => {

    // REACT-COOKIE HOOK
    const [cookies, setCookie, removeCookie] = useCookies([STATE_KEY, CODE_VERIFIER_KEY]); // Dependencies: cookie names that the component depend on or that should trigger a re-render.

    // REACT-REDUX HOOK
    const { playlist, process: { status }, track, user } = useSelector(state => state);

    // CUSTOM HOOKS
    const { getRandomPlaylist, handleFollow } = usePlaylistStore(cookies.access_token);

    const { handleLike } = useTrackStore(cookies.access_token);

    // REACT HOOKS
    useEffect(() => {

        // Removes the cookie after the login is successful.
        if (cookies.spotify_auth_state) removeCookie(STATE_KEY);

        // Removes the cookie after the login is successful.
        if (cookies.code_verifier) removeCookie(CODE_VERIFIER_KEY);

    }, []);


    return (

        <>

            <header>

                <NavBar />

            </header>

            <main className='main'>

                <section className='displayTrack'>

                    {/* CONTAINED BUTTON */}
                    <button
                        onClick={getRandomPlaylist}
                        disabled={user.isError || status === STATUS.LOADING}
                    >

                        {status === STATUS.LOADING ? (<Spinner />) : ('RANDOM TRACK')}

                    </button>

                    {
                        status === STATUS.LOADING || track.isEmpty ? (<Skeleton />) : (

                            <TrackCard {...{ handleFollow, handleLike, playlist, track }} />

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