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

    // CUSTOM HOOKS
    const { requestRefreshedAccessToken } = useAuth();

    useUserStore({ token, user });

    const { handleFollow } = usePlaylistStore({ playlist, token, user });

    const { handleLike } = useTrackStore({ playlist, status, token, track });

    // EVENT
    // This action will trigger the second useEffect, restarting the process of obtaining a new random track.
    const handleAnotherShuffleTrack = () => dispatch(setPlaylistUndone());

    // REACT HOOKS
    useEffect(() => {

        // Every time the token expires, the useEffect will be triggered to request a refreshed access token.
        if (!token) requestRefreshedAccessToken();

    }, [token]);


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