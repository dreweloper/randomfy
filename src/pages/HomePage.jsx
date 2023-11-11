import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Spinner, Toast, TrackCard } from '../components';
import { useAuth, usePlaylistStore, useShuffleTrack, useTrackStore, useUserStore } from '../hooks';
import { Footer, NavBar } from '../layouts';
import { STATUS } from '../utils';
import styles from '../sass/pages/_HomePage.module.scss';

export const HomePage = ({ token }) => {

    // REACT HOOK
    /**
     * Used to track whether the token has been refreshed to prevent multiple calls.
     * @type {React.MutableRefObject<Boolean>}
     */
    const isRefreshed = useRef(false);

    // REACT-REDUX HOOKS
    const playlist = useSelector(state => state.playlist);
    const status = useSelector(state => state.process.status);
    const track = useSelector(state => state.track);
    const user = useSelector(state => state.user);

    // CUSTOM HOOKS
    const { requestRefreshedAccessToken } = useAuth();

    useUserStore({ token, user });

    const { handleFollow } = usePlaylistStore({ playlist, token, user });

    const { handleLike } = useTrackStore({ playlist, status, token, track });

    const { handleAnotherShuffleTrack } = useShuffleTrack(token);

    // REACT HOOKS
    useEffect(() => {

        // On init, if the token is expired, it will request a new access and refresh tokens.
        if (!token && !isRefreshed.current) {

            isRefreshed.current = true;

            requestRefreshedAccessToken();

        };

    }, []);


    return (

        <>

            <NavBar user={user} />

            <main className={styles.main}>

                <section className={styles.wrapper}>

                    <button
                        className={styles.solidBtn}
                        onClick={handleAnotherShuffleTrack}
                        disabled={user.isError || status === STATUS.LOADING} // The 'user.isError' conditional is utilized because the custom hook 'usePlaylistStore' relies on the user ID. If this custom hook fails, the other functions won't be invoked.
                    >

                        {status === STATUS.LOADING ? (<Spinner />) : ('Random track')}

                    </button>

                    <TrackCard {...{ handleFollow, handleLike, playlist, status, track, user }} />

                </section>

                {
                    // Toasts are used for handling any errors other than user-related errors.
                    (status === STATUS.FAILED && !user.isError) && (

                        <Toast
                            type={'danger'}
                            text={"Oops! We couldn't load the track. Please try again."}
                        />

                    )
                }

            </main >

            <Footer />

        </>

    );

};