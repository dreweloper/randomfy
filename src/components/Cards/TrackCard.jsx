import { Link } from 'react-router-dom';
import { Image } from '../Assets';
import { AudioPlayer } from '../Media';
import { DESKTOP } from '../../utils';

export const TrackCard = ({ handleFollow, handleLike, playlist, track }) => {


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
                        <button onClick={handleFollow}>

                            {playlist.isFollowed ? 'UNFOLLOW PLAYLIST' : 'FOLLOW PLAYLIST'}

                        </button>

                        {/* OUTLINED BUTTON */}
                        <button onClick={handleLike}>

                            <span className="material-symbols-rounded">
                                favorite
                            </span>

                        </button>

                        {/* OUTLINED BUTTON STYLES */}
                        <Link
                            to={track.track_url}
                            target={DESKTOP ? '_blank' : '_self'}
                        >

                            {/* 'PLAY ON' span + Spotify logo image */}
                            PLAY ON SPOTIFY

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