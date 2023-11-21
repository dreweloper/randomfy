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
    const { requestRefreshedAccessToken } = useAuth();

    const { getUserProfile } = useUserStore();

    const { getRandomPlaylist } = usePlaylistStore();

    const { getRandomTrack } = useTrackStore();

    // FUNCTIONS
    // if the token is expired, it will request a new access and refresh tokens.
    const checkTokenValidity = async () => {

        let response;

        try {

            // Access token is expired.
            if (!cookies?.access_token) {

                response = await requestRefreshedAccessToken();

                if (response?.ok) {

                    setCookie(ACCESS_TOKEN_KEY, response.access_token, { maxAge: MAX_AGE.ACCESS_TOKEN });

                    setCookie(REFRESH_TOKEN_KEY, response.refresh_token, { maxAge: MAX_AGE.REFRESH_TOKEN });

                };

            };

            /**
             * If the token was refreshed, it will return 'response.access_token';
             * otherwise, if the token has not expired, it will return 'cookies.access_token'.
             */
            const token = response?.access_token || cookies.access_token;

            return {
                ok: true,
                token
            };

        } catch (error) {

            throw error;

        };

    }; //!FUNC-CHECKTOKENVALIDITY

    const onInit = async () => {

        let response, token;

        try {

            dispatch(setStatus(STATUS.LOADING));

            response = await checkTokenValidity();

            if (response?.ok) {

                token = response.token; // The 'checkTokenValidity' response.

                response = await getUserProfile(token);

                if (response?.ok) {

                    const { userId } = response; // The 'getUserProfile' response.

                    response = await getRandomPlaylist(token, userId);

                    if (response?.ok) {

                        const { playlistId, totalTracks } = response; // The 'getRandomPlaylist' response;

                        response = await getRandomTrack(token, playlistId, totalTracks);

                        if (response?.ok) {

                            dispatch(setStatus(STATUS.SUCCEEDED));

                        };
                    };
                };
            };

        } catch (error) {

            console.error(error);

            dispatch(setStatus(STATUS.FAILED));

            //TODO: status >= 400 ... status >= 500... set Redux status failed and message to render.

        };

    }; //!FUNC-ONINIT

    // EVENT
    const handleShuffle = async () => {

        let response, token;

        try {

            dispatch(setStatus(STATUS.LOADING));

            response = await checkTokenValidity();

            if (response?.ok) {

                token = response.token; // The 'checkTokenValidity' response.

                response = await getRandomPlaylist(token, user.id); // The 'id' property from the 'user' Redux state.

                if (response?.ok) {

                    const { playlistId, totalTracks } = response;

                    response = await getRandomTrack(token, playlistId, totalTracks);

                    if (response?.ok) {

                        dispatch(setStatus(STATUS.SUCCEEDED));

                    };
                };
            };

        } catch (error) {

            console.error(error);

            dispatch(setStatus(STATUS.FAILED));

            //TODO: status >= 400 ... status >= 500... set Redux status failed and message to render.

        };

    }; //!FUNC-HANDLESHUFFLE


    useEffect(() => {

        if (isFirstLoadRef.current) {

            // Update the ref to indicate that the first load is completed and prevent multiple calls.
            isFirstLoadRef.current = false;

            onInit();

        };

    }, []);


    return (

        <>

            <NavBar user={user} />

            <main className={styles.main}>

                <section className={styles.wrapper}>

                    <button
                        className={styles.solidBtn}
                        onClick={handleShuffle}
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