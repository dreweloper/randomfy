import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner, Toast, TrackCard } from '../components';
import { useAuth, usePlaylistStore, useTrackStore, useUserStore } from '../hooks';
import { Footer, NavBar } from '../layouts';
import { setPlaylistUndone, setStatus } from '../store/slices';
import { STATUS } from '../utils';
import styles from '../sass/pages/_HomePage.module.scss';

export const HomePage = ({ token }) => {

    // REACT-REDUX HOOKS
    const playlist = useSelector(state => state.playlist);
    const status = useSelector(state => state.process.status);
    const track = useSelector(state => state.track);
    const user = useSelector(state => state.user);

    const dispatch = useDispatch();

    // CUSTOM HOOKS
    const { requestRefreshedAccessToken } = useAuth();

    useUserStore({ token, user });

    const { handleFollow } = usePlaylistStore({ playlist, status, token, user });

    const { handleLike } = useTrackStore({ playlist, status, token, track });

    // EVENT
    const handleAnotherShuffleTrack = async () => {

        try {

            dispatch(setStatus(STATUS.LOADING));

            if (token) {

                dispatch(setPlaylistUndone());

            } else {

                const response = await requestRefreshedAccessToken();

                if (response.ok) {

                    setTimeout(() => {

                        dispatch(setPlaylistUndone());

                    }, 500); // To ensure that the refreshed access token is stored in cookies before trying to generate a new random track.

                };

            };

        } catch (error) {

            console.error(error);

        };

    }; //!FUNC-HANDLEANOTHERSHUFFLETRACK

    // REACT HOOKS
    useEffect(() => {

        // On init, if the token is expired, it will request a new access and refresh tokens.
        if (!token) requestRefreshedAccessToken();

    }, []);


    return (

        <>

            <NavBar user={user} />

            <main className={styles.main}>

                <section className={styles.wrapper}>

                    <button
                        className={styles.solidBtn}
                        onClick={handleAnotherShuffleTrack}
                        disabled={user.isError || status === STATUS.LOADING}
                    >

                        {status === STATUS.LOADING ? (<Spinner />) : ('Random track')}

                    </button>

                    <TrackCard {...{ handleFollow, handleLike, playlist, status, track, user }} />

                </section>

                {
                    status === STATUS.FAILED && (

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