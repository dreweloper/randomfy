import { useCookies } from 'react-cookie';
import { useSelector } from "react-redux";
import { usePlaylistStore, useTrackStore } from "../hooks";
import { ACCESS_TOKEN_KEY, STATUS } from '../utils';

export const Track = () => {

  // REACT-COOKIE
  const [cookies] = useCookies([ACCESS_TOKEN_KEY]);

  // REACT-REDUX HOOK
  const { status } = useSelector(state => state.process);

  // REACT-REDUX CUSTOM HOOKS
  const { playlist, getRandomPlaylist, handleFollow } = usePlaylistStore(cookies.access_token);

  const { track, handleLike } = useTrackStore(cookies.access_token);

  // VARIABLES
  /**
   * Indicates whether the 'track' state is empty, based on the length of its 'track_id' property.
   * @type {Boolean}
   */
  const trackIsEmpty = Object.keys(track.track_id).length === 0;


  return (

    <>

      <button disabled={status === STATUS.LOADING} onClick={() => { getRandomPlaylist() }}>RANDOM TRACK</button>

      { //TODO: skeleton loader
        status === STATUS.LOADING && <p>Loading…</p>
      }

      { //TODO: toast notification (or snackbar)
        status === STATUS.FAILED && <p>ERROR!</p>
      }

      { // Track information will be rendered whether the 'status' is 'succeeded' or 'failed', but always when the 'track' state is not empty.
        status !== STATUS.LOADING && !trackIsEmpty && (

          <>

            <img src={track.album_cover} alt='Album cover' title='Album cover' width='100' />

            <button onClick={handleFollow}>{playlist.isFollowed ? 'Unfollow playlist' : 'Follow playlist'}</button>

            <button onClick={handleLike}>{track.isLiked ? 'Dislike track' : 'Like track'}</button>
            {/* <button id={track.track_id} data-state={track.isLiked} onClick={() => handleTrackLikeStatus(track)}>{track.isLiked ? 'Dislike track' : 'Like track'}</button> */}

          </>

        )
      }

    </>

  );

};