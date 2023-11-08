import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Image } from '../Assets';
import { AudioPlayer } from '../Media';
import { DESKTOP } from '../../utils';
import styles from '../../sass/components/_TrackCard.module.scss';

export const TrackCard = ({ handleFollow, handleLike, playlist, track }) => {

    // REACT HOOK
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
         * The value of the CSS variable '--like-icon-fill' is set to '1' when 'track.isLiked' is true and '0' when it's false.
         * @type {Number}
         */
        const value = track.isLiked ? 1 : 0;

        // Updates the value of the CSS variable '--like-icon-fill' to reflect if the track has been added ('true') or deleted ('false') from the user's 'Your Music' library.
        likeButtonRef.current.style.setProperty('--like-icon-fill', value);

    }, [track.isLiked]);


    return (

        <article className={styles.card}>

            <div className={styles.wrapper}>

                <Image
                    className={styles.artwork}
                    description={`Album artwork for "${track.album}"`}
                    source={track.artwork}
                />

                <div className={styles.container}>

                    <div className={styles.details}>

                        <h2 className={styles.name}>{track.name}</h2>

                        <h2 className={styles.artists}>{track.artists}</h2>

                    </div>

                    {/* TODO: !DESKTOP && visible (CSS media queries) */}
                    <div className={styles.nonDesktopContainer}>

                        <AudioPlayer trackPreview={track.preview_url} />

                    </div>

                    <nav className={styles.nav}>

                        {/* OUTLINED BUTTON */}
                        <button
                            className={styles.button}
                            onClick={handleLike}
                            ref={likeButtonRef}
                        >

                            <span className={`${styles.favoriteIcon} material-symbols-rounded`}>
                                favorite
                            </span>

                        </button>

                        {/* OUTLINED BUTTON */}
                        <button
                            className={styles.button}
                            onClick={handleFollow}
                        >

                            {playlist.isFollowed ? 'Unfollow playlist' : 'Follow playlist'}

                        </button>

                        {/* OUTLINED BUTTON STYLES */}
                        <Link
                            className={`${styles.button} ${styles.link}`}
                            to={track.track_url}
                            target={DESKTOP ? '_blank' : '_self'}
                        >

                            <span>Play on</span>

                            <Image
                                className={styles.logo}
                                description={'Spotify Logo'}
                                source={'/assets/spotify/icons/Spotify_Icon_RGB_Green.png'}
                            />

                        </Link>

                    </nav>

                </div>

            </div>

            {/* TODO: DESKTOP && visible (CSS media-queries) */}
            <div className={styles.desktopContainer}>

                <AudioPlayer trackPreview={track.preview_url} />

            </div>

        </article>


    );

};