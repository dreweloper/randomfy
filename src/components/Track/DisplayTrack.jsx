import { useCookies } from 'react-cookie';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { usePlaylistStore, useTrackStore } from "../../hooks";
import { AudioPlayer, Button, LikeIcon } from '../../components';
import { ACCESS_TOKEN_KEY, STATUS } from '../../utils';

export const DisplayTrack = () => {

    // REACT-COOKIE
    const [cookies] = useCookies([ACCESS_TOKEN_KEY]);

    // REACT-REDUX HOOK
    const { status } = useSelector(state => state.process);

    // REACT-REDUX CUSTOM HOOKS
    const { playlist, getRandomPlaylist, handleFollow } = usePlaylistStore(cookies.access_token);

    const { track, handleLike } = useTrackStore(cookies.access_token);


    return (

        <>

            <Button onClick={getRandomPlaylist} disabled={status === STATUS.LOADING}>

                {status === STATUS.LOADING ? '(SPINNER LOADER)' : 'RANDOM TRACK'}

            </Button>

            {
                status === STATUS.LOADING ? (

                    <p>(SKELETON LOADER)</p>

                ) : (

                    !track.isEmpty ? (

                        <>

                            <img
                                src={track.artwork}
                                alt={`Album artwork for "${track.album}"`}
                                title={`Album artwork for "${track.album}"`}
                                width='100'
                            />

                            <AudioPlayer trackPreview={track.preview_url} />

                            <span>{!track.preview_url && 'Track preview is not available'}</span>

                            <Button onClick={handleFollow}>

                                {playlist.isFollowed ? 'UNFOLLOW PLAYLIST' : 'FOLLOW PLAYLIST'}

                            </Button>

                            <Button onClick={handleLike}>

                                <LikeIcon />

                            </Button>

                            {/* //TODO: Spotify logo and 'ExternalLink' (or Button(?) component (?) */}
                            <Link to={track.track_url}>PLAY ON SPOTIFY</Link>

                        </>

                    ) : (

                        <p>(SKELETON LOADER)</p>

                    )

                )

            }

            { //TODO: alert (or toast or snackbar) notification
                status === STATUS.FAILED && <p>ERROR!</p>
            }

        </>

    );

};