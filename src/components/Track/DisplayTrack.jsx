import { useCookies } from 'react-cookie';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { usePlaylistStore, useTrackStore } from "../../hooks";
import { AudioPlayer, Button, LikeIcon } from '../../components';
import { ACCESS_TOKEN_KEY, DESKTOP, STATUS } from '../../utils';

export const DisplayTrack = () => {

    // REACT-COOKIE
    const [cookies] = useCookies([ACCESS_TOKEN_KEY]);

    // REACT-REDUX HOOK
    const { process: { status }, user } = useSelector(state => state);

    // REACT-REDUX CUSTOM HOOKS
    const { playlist, getRandomPlaylist, handleFollow } = usePlaylistStore(cookies.access_token);

    const { track, handleLike } = useTrackStore(cookies.access_token);


    return (

        <section className='displayTrack'>

            <Button
                onClick={getRandomPlaylist}
                disabled={user.isError || status === STATUS.LOADING}
            >

                {status === STATUS.LOADING ? 'SPINNER LOADER' : 'RANDOM TRACK'}

            </Button>

            {
                status === STATUS.LOADING ? (

                    //TODO: Skeleton component
                    <span>SKELETON LOADER</span>

                ) : (

                    !track.isEmpty ? (

                        <article className='trackCard'>

                            <div className='cardContainer'>

                                <div className='artwork'>

                                    <img
                                        src={track.artwork}
                                        alt={`Album artwork for "${track.album}"`}
                                        title={`Album artwork for "${track.album}"`}
                                        width='100'
                                    />

                                </div>

                                <div className='trackContainer'>

                                    <div className='trackDetails'>

                                        <h2 className='trackName'>{track.name}</h2>

                                        <h2 className='trackArtists'>{JSON.stringify(track.artists)}</h2>

                                    </div>

                                    {/* TODO: !DESKTOP && visible */}
                                    <div className='nonDesktopContainer'>

                                        <AudioPlayer trackPreview={track.preview_url} />

                                    </div>

                                    <nav className='trackNav'>

                                        {/* OUTLINED BUTTON COMPONENT */}
                                        <Button onClick={handleFollow}>

                                            {playlist.isFollowed ? 'UNFOLLOW PLAYLIST' : 'FOLLOW PLAYLIST'}

                                        </Button>

                                        {/* OUTLINED BUTTON COMPONENT */}
                                        <Button onClick={handleLike}>

                                            <LikeIcon />

                                        </Button>

                                        {/* OUTLINED BUTTON STYLES */}
                                        <Link
                                            to={track.track_url}
                                            target={DESKTOP ? '_blank' : '_self'}
                                        >

                                            <span>PLAY ON</span>

                                            {/* IMG: SPOTIFY LOGO */}
                                            <span>SPOTIFY</span>

                                        </Link>

                                    </nav>

                                </div>

                            </div>

                            {/* TODO: DESKTOP && visible */}
                            <div className='desktopContainer' style={{ display: 'none' }}>

                                <AudioPlayer trackPreview={track.preview_url} />

                            </div>

                        </article>

                    ) : (

                        //TODO: Skeleton component
                        <span>SKELETON LOADER</span>

                    )

                )

            }

            {
                //TODO: Toast component
                status === STATUS.FAILED && <span>ERROR TOAST</span>
            }

        </section>

    );

};