import { Link } from 'react-router-dom';
import { Image } from '../Assets';
import { AudioPlayer } from '../Media';
import { usePlaylistStore, useTrackStore } from '../../hooks';
import { DESKTOP } from '../../utils';

export const TrackCard = ({ playlist, token, track }) => {

    // CUSTOM HOOKS
    const { handleFollow } = usePlaylistStore(token);

    const { handleLike } = useTrackStore(token);


    return (

        <article className='trackCard'>

            <div className='cardContainer'>

                <Image
                    className={'artwork'}
                    description={`Album artwork for "${track.album}"`}
                    source={track.artwork}
                />

                <div className='trackContainer'>

                    <div className='trackDetails'>

                        <h2 className='trackName'>{track.name}</h2>

                        <h2 className='trackArtists'>{track.artists}</h2>

                    </div>

                    {/* TODO: !DESKTOP && visible (CSS media queries) */}
                    <div className='nonDesktopContainer'>

                        <AudioPlayer trackPreview={track.preview_url} />

                    </div>

                    <nav className='trackNav'>

                        {/* OUTLINED BUTTON */}
                        <button onClick={() => handleFollow(playlist)}>

                            {playlist.isFollowed ? 'UNFOLLOW PLAYLIST' : 'FOLLOW PLAYLIST'}

                        </button>

                        {/* OUTLINED BUTTON */}
                        <button onClick={() => handleLike(track)}>

                            <span className="material-symbols-rounded">
                                favorite
                            </span>

                        </button>

                        {/* OUTLINED BUTTON STYLES */}
                        <Link
                            to={track.track_url}
                            target={DESKTOP ? '_blank' : '_self'}
                        >

                            <span>PLAY ON</span>

                            <Image
                                className={'spotifyLogo'}
                                description={'Spotify Logo'}
                                source={'/assets/spotify/icons/Spotify_Icon_RGB_Green.png'}
                            />

                        </Link>

                    </nav>

                </div>

            </div>

            {/* TODO: DESKTOP && visible (CSS media-queries) */}
            <div className='desktopContainer' style={{ display: 'none' }}>

                <AudioPlayer trackPreview={track.preview_url} />

            </div>

        </article>


    );

};