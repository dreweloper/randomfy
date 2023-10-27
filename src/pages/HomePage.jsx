import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AudioPlayer } from '../components/Media';
import { usePlaylistStore, useTrackStore } from '../hooks';
import { Footer, NavBar } from '../layouts';
import { CODE_VERIFIER_KEY, DESKTOP, STATE_KEY, STATUS } from '../utils';

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

            <main>

                <section className='displayTrack'>

                    <button
                        onClick={getRandomPlaylist}
                        disabled={user.isError || status === STATUS.LOADING}
                    >

                        {status === STATUS.LOADING ? 'SPINNER LOADER' : 'RANDOM TRACK'}

                    </button>

                    {
                        status === STATUS.LOADING ? (

                            //TODO: Skeleton component
                            <span>SKELETON LOADER</span>

                        ) : (

                            !track.isEmpty ? (

                                <article className='trackCard'>

                                    <div className='cardContainer'>

                                        <div className='artwork'>

                                            <img
                                                src={track.artwork}
                                                alt={`Album artwork for "${track.album}"`}
                                                title={`Album artwork for "${track.album}"`}
                                                width='100'
                                            />

                                        </div>

                                        <div className='trackContainer'>

                                            <div className='trackDetails'>

                                                <h2 className='trackName'>{track.name}</h2>

                                                <h2 className='trackArtists'>{track.artists}</h2>

                                            </div>

                                            {/* TODO: !DESKTOP && visible (CSS media queries) */}
                                            <div className='nonDesktopContainer'>

                                                <AudioPlayer trackPreview={track.preview_url} />

                                            </div>

                                            <nav className='trackNav'>

                                                {/* OUTLINED BUTTON */}
                                                <button onClick={handleFollow}>

                                                    {playlist.isFollowed ? 'UNFOLLOW PLAYLIST' : 'FOLLOW PLAYLIST'}

                                                </button>

                                                {/* OUTLINED BUTTON */}
                                                <button onClick={handleLike}>

                                                    <span className="material-symbols-rounded">
                                                        favorite
                                                    </span>

                                                </button>

                                                {/* OUTLINED BUTTON STYLES */}
                                                <Link
                                                    to={track.track_url}
                                                    target={DESKTOP ? '_blank' : '_self'}
                                                >

                                                    <span>PLAY ON</span>

                                                    {/* IMG: SPOTIFY LOGO */}
                                                    <span>SPOTIFY</span>

                                                </Link>

                                            </nav>

                                        </div>

                                    </div>

                                    {/* TODO: DESKTOP && visible (CSS media-queries) */}
                                    <div className='desktopContainer' style={{ display: 'none' }}>

                                        <AudioPlayer trackPreview={track.preview_url} />

                                    </div>

                                </article>

                            ) : (

                                //TODO: Skeleton component
                                <span>SKELETON LOADER</span>

                            )
                        )
                    }

                    {
                        //TODO: Toast component
                        status === STATUS.FAILED && <span>ERROR TOAST</span>
                    }

                </section>

            </main >

            <Footer />

        </>

    );

};