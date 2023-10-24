import { useCookies } from 'react-cookie';
import { useSelector } from "react-redux";
import { Button } from './buttons';
import { usePlaylistStore, useTrackStore } from "../hooks";
import { LikeIcon } from './icons';
import { AudioPlayer } from './index';
import { ACCESS_TOKEN_KEY, STATUS } from '../utils';

export const Track = () => {

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

              <img src={track.artwork} alt='Album cover' title='Album cover' width='100' />

              <AudioPlayer trackPreview={track.preview_url} />

              <Button onClick={handleFollow}>

                {playlist.isFollowed ? 'UNFOLLOW PLAYLIST' : 'FOLLOW PLAYLIST'}

              </Button>

              <Button onClick={handleLike}>

                <LikeIcon />

              </Button>

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