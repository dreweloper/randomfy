import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner, TrackCard } from '../components';
import { useShuffleTrack } from '../hooks';
import { Footer, NavBar } from '../layouts';
import { STATUS } from '../utils';
import styles from '../sass/pages/_HomePage.module.scss';
import { isUserLogged } from '../store/slices';

export const HomePage = ({ token }) => {

    // REACT HOOK
    /**
     * Ref to track whether the initial page load is pending (true) or not (false) to prevent multiple calls.
     * @type {React.MutableRefObject<Boolean>}
     */
    const isFirstLoadRef = useRef(true);

    // REACT-REDUX HOOKS
    const status = useSelector(state => state.process.status);

    const user = useSelector(state => state.user);

    const dispatch = useDispatch();

    // CUSTOM HOOK
    const { shuffleTrack } = useShuffleTrack();

    useEffect(() => {

        if (isFirstLoadRef.current) {

            // Update the ref to indicate that the first load is completed and prevent multiple calls.
            isFirstLoadRef.current = false;

            // State flag for rendering user information in the NavBar when logged in.
            dispatch(isUserLogged(true));

            shuffleTrack();

        };

    }, []);


    return (

        <>

            <NavBar />

            <main className={styles.main}>

                <section className={styles.wrapper}>

                    <button
                        className={styles.solidBtn}
                        onClick={shuffleTrack}
                        disabled={user.isError || status === STATUS.LOADING} // The 'user.isError' conditional is utilized because the custom hook 'usePlaylistStore' relies on the user ID.
                    >

                        {status === STATUS.LOADING ? (<Spinner />) : ('Random track')}

                    </button>

                    <TrackCard isLoading={status === STATUS.LOADING} token={token} user={user} />

                </section>

                {/* "Oops! We couldn't load the track. Please try again." */}

            </main >

            <Footer />

        </>

    );

};