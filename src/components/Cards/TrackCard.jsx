import { useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { Image } from '../Assets';
import { AudioPlayer } from '../Media';
import { updateElementStyle } from '../../helpers';
import { DESKTOP, STATUS } from '../../utils';
import styles from '../../sass/components/Cards/_TrackCard.module.scss';

export const TrackCard = (props) => {

    const { handleFollow, handleLike, playlist, status, track, user } = props;

    // REACT HOOKS
    /**
     * A reference used to update the value of the CSS variable '--like-icon-fill' for the 'like' button.
     * @type {React.RefObject<HTMLButtonElement>}
     */
    const likeButtonRef = useRef();

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

        // Changes the icon fill of the like button to reflect whether the track has been added ('true') or removed ('false') from the user's 'Your Music' library.
        updateElementStyle(likeButtonRef.current, '--like-icon-fill', value);

    }, [track.isLiked, status]);


    return (

        <article className={styles.card}>

            <div className={styles.wrapper}>

                <div className={`${styles.artwork} ${status === STATUS.LOADING && 'opacity-50'}`}>

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

                    <div className={`${styles.details} ${status === STATUS.LOADING && 'opacity-50'}`}>

                        <h2 className={`${styles.name} ${track.isEmpty && 'skeleton-text'}`}>
                            {track.name}
                        </h2>

                        <h2 className={`${styles.artists} ${track.isEmpty && 'skeleton-text'}`}>
                            {track.artists}
                        </h2>

                    </div>

                    {/* NON DESKTOP AUDIO PLAYER CONTAINER */}
                    <div className={`${styles.nonDesktopContainer} ${status === STATUS.LOADING && 'pointer-events'}`}>

                        {
                            track.preview_url !== null ? (

                                <AudioPlayer trackPreview={track.preview_url} />

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
                            className={styles.button}
                            onClick={handleLike}
                            disabled={user.isError || status === STATUS.LOADING}
                            ref={likeButtonRef}
                        >

                            <span className={`${styles.favoriteIcon} material-symbols-rounded`}>
                                favorite
                            </span>

                        </button>

                        <button
                            className={styles.button}
                            onClick={handleFollow}
                            disabled={user.isError || status === STATUS.LOADING}
                        >

                            {playlist.isFollowed ? 'Unfollow playlist' : 'Follow playlist'}

                        </button>

                        <button
                            className={styles.button}
                            disabled={user.isError || status === STATUS.LOADING}
                        >

                            {/* PENDING: implement a conditional to disable the 'to' prop if 'track_url' is empty. */}
                            <Link
                                className={styles.link}
                                to={track.track_url}
                                target={DESKTOP ? '_blank' : '_self'}>

                                <span className={styles.linkText}>Play on</span>

                                <Image
                                    className={styles.logo}
                                    description={'Spotify Logo'}
                                    source={'/assets/spotify/icons/Spotify_Icon_RGB_Green.png'}
                                />

                            </Link>

                        </button>

                    </nav>

                </div>

            </div>

            {/* DESKTOP AUDIO PLAYER CONTAINER */}
            <div className={styles.desktopContainer}>

                <AudioPlayer trackPreview={track.preview_url} />

            </div>

        </article>


    );

};