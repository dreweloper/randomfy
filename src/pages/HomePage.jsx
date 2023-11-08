import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton, Spinner, Toast, TrackCard } from '../components';
import { useAuth, usePlaylistStore, useTrackStore, useUserStore } from '../hooks';
import { Footer, NavBar } from '../layouts';
import { setPlaylistUndone } from '../store/slices';
import { STATUS } from '../utils';
import styles from '../sass/pages/_HomePage.module.scss';

export const HomePage = ({ token }) => {

    // REACT-REDUX HOOKS
    const { playlist, process: { status }, track, user } = useSelector(state => state);

    const dispatch = useDispatch();

    // VARIABLES
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
    const handleAnotherShuffleTrack = () => dispatch(setPlaylistUndone()); //!FUNC-HANDLEANOTHERSHUFFLETRACK

    // REACT HOOKS
    //* Handles token expiration and sets 'user' state.
    useEffect(() => {

        /**
         * On init, if the token cookie is expired, it will be triggered again to set the 'user' state.
         * After that, every time the token expires, the useEffect will be triggered to request a refreshed access token.
         */
        !token ? requestRefreshedAccessToken() : user.isEmpty && getUserProfile();

    }, [token]);

    //* Sets 'playlist' state.
    useEffect(() => {

        /**
         * If the token is expired during the initial page load, the user data will be empty.
         * Once the token is refreshed, the user profile will be set, and this useEffect will be triggered again due to the 'user' dependency.
         * From there, the useEffect will trigger every time the user clicks the 'Random track' button that modifies the 'isDone' prop of the 'playlist' state.
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

            <NavBar />

            <main className={styles.main}>

                <section className={styles.wrapper}>

                    <button
                        className={styles.solidBtn}
                        onClick={handleAnotherShuffleTrack}
                        disabled={user.isError || status === STATUS.LOADING}
                    >

                        {status === STATUS.LOADING ? (<Spinner />) : ('Random track')}

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