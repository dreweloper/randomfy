import { useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner, TrackCard } from '../components';
import { useAuth, usePlaylistStore, useTrackStore, useUserStore } from '../hooks';
import { Footer, NavBar } from '../layouts';
import { setStatus } from '../store/slices';
import { ACCESS_TOKEN_KEY, MAX_AGE, REFRESH_TOKEN_KEY, STATUS } from '../utils';
import styles from '../sass/pages/_HomePage.module.scss';

export const HomePage = () => {

    // REACT HOOK
    /**
     * Ref to track whether the initial page load is pending (true) or not (false) to prevent multiple calls.
     * @type {React.MutableRefObject<Boolean>}
     */
    const isFirstLoadRef = useRef(true);

    // REACT-REDUX HOOKS
    const playlist = useSelector(state => state.playlist);
    const status = useSelector(state => state.process.status);
    const track = useSelector(state => state.track);
    const user = useSelector(state => state.user);

    const dispatch = useDispatch();

    // REACT-COOKIE HOOK
    const [cookies, setCookie] = useCookies([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);

    // CUSTOM HOOKS
    const { logout, requestRefreshedAccessToken } = useAuth();

    const { getUserProfile } = useUserStore();

    const { getRandomPlaylist } = usePlaylistStore();

    const { getRandomTrack } = useTrackStore();

    // FUNCTIONS
    /**
     * Checks the validity of the Spotify API access token.
     * 
     * @async
     * @function checkTokenValidity
     * @returns {Object} An object with a boolean property 'ok' indicating the success status and the Spotify API access token.
     * @throws {Error}
     */
    const checkTokenValidity = async () => {

        /**
         * If the access token is valid, it returns 'cookies.access_token';
         * otherwise, if the token has expired, it returns 'response.access_token' (a refreshed access token).
         * This approach ensures that the time taken to set tokens in cookies won't affect subsequent fetch calls.
         * 
         * The Spotify API's access token.
         * @type {String}
         */
        let token = cookies?.access_token;

        try {

            // Access token is expired.
            if (!cookies?.access_token) {

                const response = await requestRefreshedAccessToken();

                if (response?.ok) {

                    token = response.access_token;

                    setCookie(ACCESS_TOKEN_KEY, response.access_token, { maxAge: MAX_AGE.ACCESS_TOKEN });

                    setCookie(REFRESH_TOKEN_KEY, response.refresh_token, { maxAge: MAX_AGE.REFRESH_TOKEN });

                };

            };

            return { ok: true, token };

        } catch (error) {

            throw error;

        };

    }; //!FUNC-CHECKTOKENVALIDITY

    const shuffleTrack = async () => {

        /**
         * On the initial load, 'user.id' is an empty string due to 'user.isEmpty'.
         * Subsequently, 'getUserProfile' sets the new 'user.id'.
         * After the first load is completed, '!user.isEmpty' ensures 'user.id' is already set.
         * 
         * The Spotify user ID for the user.
         * @type {String}
         */
        let userId = user.id;

        try {

            dispatch(setStatus(STATUS.LOADING));

            let response = await checkTokenValidity();

            if (response?.ok) {

                const token = response.token; // The 'checkTokenValidity' response.

                // This will only be triggered during the initial load.
                if (user.isEmpty) {

                    response = await getUserProfile(token);

                    if (response?.ok) {

                        userId = response.id; // The 'getUserProfile' response.

                    };

                };

                response = await getRandomPlaylist(token, userId);

                if (response?.ok) {

                    const { playlistId, totalTracks } = response; // The 'getRandomPlaylist' response;

                    response = await getRandomTrack(token, playlistId, totalTracks);

                    if (response?.ok) {

                        dispatch(setStatus(STATUS.SUCCEEDED));

                    };
                };
            };

        } catch (error) {

            console.error(error);

            if (error.message === 'Refresh token revoked' || error.message === 'Invalid refresh token') {

                logout();

            };

            dispatch(setStatus(STATUS.FAILED));

            //TODO: status >= 400 ... status >= 500... set Redux status failed and message to render.

        };

    }; //!FUNC-ONINIT

    useEffect(() => {

        if (isFirstLoadRef.current) {

            // Update the ref to indicate that the first load is completed and prevent multiple calls.
            isFirstLoadRef.current = false;

            shuffleTrack();

        };

    }, []);


    return (

        <>

            <NavBar user={user} />

            <main className={styles.main}>

                <section className={styles.wrapper}>

                    <button
                        className={styles.solidBtn}
                        onClick={shuffleTrack}
                        disabled={user.isError || status === STATUS.LOADING} // The 'user.isError' conditional is utilized because the custom hook 'usePlaylistStore' relies on the user ID. If this custom hook fails, the other functions won't be invoked.
                    >

                        {status === STATUS.LOADING ? (<Spinner />) : ('Random track')}

                    </button>

                    <TrackCard {...{ playlist, status, token: cookies.access_token, track, user }} />

                </section>

                {/* "Oops! We couldn't load the track. Please try again." */}

            </main >

            <Footer />

        </>

    );

};