import { Link } from 'react-router-dom';
import { Image } from '../Assets';
import { AudioPlayer } from '../Media';
import { usePlaylistStore, useTrackStore } from '../../hooks';
import { DESKTOP } from '../../utils';
import styles from '../../sass/components/_TrackCard.module.scss';

export const TrackCard = ({ playlist, token, track }) => {

    // CUSTOM HOOKS
    const { handleFollow } = usePlaylistStore(token);

    const { handleLike } = useTrackStore(token);


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
                            onClick={() => handleLike(track)}
                        >

                            <span className={`${styles.favoriteIcon} material-symbols-rounded`}>
                                favorite
                            </span>

                        </button>

                        {/* OUTLINED BUTTON */}
                        <button
                            className={styles.button}
                            onClick={() => handleFollow(playlist)}
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