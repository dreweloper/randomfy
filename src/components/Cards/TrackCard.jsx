import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { AudioPlayer } from '../Media';
import { Toast } from '../Notifications';
import { updateElementStyle } from '../../helpers';
import { usePlaylistStore, useTrackStore } from '../../hooks';
import { DESKTOP } from '../../utils';
import styles from '../../sass/components/Cards/_TrackCard.module.scss';

export const TrackCard = ({ isLoading, token, user }) => {

    // REACT HOOKS
    const [toastText, setToastText] = useState('');

    /**
     * A reference used to update the value of the CSS variable '--like-icon-fill' for the 'like' button.
     * @type {React.RefObject<HTMLButtonElement>}
     */
    const likeButtonRef = useRef();

    // REACT-REDUX HOOKS
    const playlist = useSelector(state => state.playlist);

    const track = useSelector(state => state.track);

    // CUSTOM HOOKS
    const { handleFollow } = usePlaylistStore();

    const { handleLike } = useTrackStore();

    // EVENT
    const handleClick = async ({ target }) => {

        try {
            
            const response = (target.id === 'like') ? await handleLike(token) : await handleFollow(token);

            if (response?.ok) {

                setToastText(response.text);

            };

        } catch (error) {
            
            console.error(error);

            //TODO: handle error alert.

        };

    }; //!FUNC-HANDLECLICK

    /**
     * Besides the first rendering, this effect will be triggered every time the user clicks on the "like" button
     * and the track is successfully added or removed from the 'Your Music' library.
     */
    useEffect(() => {

        /**
         * The value of the CSS variable '--like-icon-fill' is set to 1 when 'track.isLiked' is 'true' and 0 when it's 'false'.
         * @type {Number}
         */
        const value = track.isLiked ? 1 : 0;

        // Changes the icon fill of the like button to reflect whether the track has been added (true) or removed (false) from the user's 'Your Music' library.
        updateElementStyle(likeButtonRef.current, '--like-icon-fill', value);

    }, [track.isLiked]);


    return (

        <>

            <article className={`${styles.card} ${isLoading && 'opacity-50'}`}>

                <div className={styles.wrapper}>

                    {/* ALBUM COVER */}
                    <div className={styles.artwork}>

                        {
                            !track.isEmpty ? (

                                <img
                                    src={track.artwork}
                                    alt={`Album artwork for "${track.album}"`}
                                    title={`Album artwork for "${track.album}"`}
                                />

                            ) : (

                                <span className={styles.skeleton}></span>

                            )
                        }

                    </div>

                    <div className={styles.container}>

                        {/* TRACK NAME AND ARTISTS */}
                        <div className={styles.details}>

                            <h2 className={`${styles.name} ${track.isEmpty && 'skeleton-text'}`}>
                                {track.name}
                            </h2>

                            <h2 className={`${styles.artists} ${track.isEmpty && 'skeleton-text'}`}>
                                {track.artists}
                            </h2>

                        </div>

                        {/* NON DESKTOP AUDIO PLAYER CONTAINER */}
                        <div className={`${styles.nonDesktopContainer} ${isLoading && 'pointer-events'}`}>

                            {
                                track.preview_url !== null ? (

                                    <AudioPlayer isLoading={isLoading} trackPreview={track.preview_url} />

                                ) : (

                                    <div className={styles.warningContainer}>

                                        <span className={`${styles.warningIcon} material-symbols-rounded`}>
                                            warning
                                        </span>

                                        <p className={styles.warningText}>Track preview is not available.</p>

                                    </div>

                                )
                            }

                        </div>

                        <nav className={styles.nav}>

                            <button
                                id='like'
                                className={styles.button}
                                onClick={handleClick}
                                disabled={user.isError || isLoading}
                                ref={likeButtonRef}
                            >

                                <span className={`${styles.favoriteIcon} material-symbols-rounded`}>
                                    favorite
                                </span>

                            </button>

                            <button
                                id='follow'
                                className={styles.button}
                                onClick={handleClick}
                                disabled={user.isError || isLoading}
                            >

                                {playlist.isFollowed ? 'Unfollow playlist' : 'Follow playlist'}

                            </button>

                            <button
                                className={styles.button}
                                disabled={user.isError || isLoading}
                            >

                                <Link
                                    className={`${styles.link} ${isLoading && 'pointer-events'}`}
                                    to={track.track_url}
                                    target={DESKTOP ? '_blank' : '_self'}>

                                    <span className={styles.linkText}>Play on</span>

                                    <img
                                        className={styles.logo}
                                        src='/assets/spotify/icons/Spotify_Icon_RGB_Green.png'
                                        alt='Spotify Logo'
                                        title='Spotify Logo'
                                    />

                                </Link>

                            </button>

                        </nav>

                    </div>

                </div>

                {/* DESKTOP AUDIO PLAYER CONTAINER */}
                <div className={styles.desktopContainer}>

                    {
                        track.preview_url !== null ? (

                            <AudioPlayer isLoading={isLoading} trackPreview={track.preview_url} />

                        ) : (

                            <div className={styles.warningContainer}>

                                <span className={`${styles.warningIcon} material-symbols-rounded`}>
                                    warning
                                </span>

                                <p className={styles.warningText}>Track preview is not available.</p>

                            </div>

                        )
                    }

                </div>

            </article>

            <Toast text={toastText} />

        </>

    );

};