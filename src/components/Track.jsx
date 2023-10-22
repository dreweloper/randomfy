import { useCookies } from 'react-cookie';
import { useSelector } from "react-redux";
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

    <main>

      <button
        disabled={status === STATUS.LOADING}
        onClick={getRandomPlaylist}>
        {status === STATUS.LOADING ? 'Loading…' : 'RANDOM TRACK'}
      </button>

      {
        !track.isEmpty && (

          <>

            <img src={track.artwork} alt='Album cover' title='Album cover' width='100' />

            <AudioPlayer trackPreview={track.preview_url} />

            <button onClick={handleFollow}>{playlist.isFollowed ? 'Unfollow playlist' : 'Follow playlist'}</button>

            <button onClick={handleLike}>
              {
                <>
                  <span>{track.isLiked ? 'Dislike' : 'Like'}</span>
                  <LikeIcon />
                </>
              }
            </button>

          </>

        )

      }

      { //TODO: toast notification (or snackbar)
        status === STATUS.FAILED && <p>ERROR!</p>
      }

    </main>

  );

};