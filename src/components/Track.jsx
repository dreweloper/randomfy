import { useSelector } from "react-redux";
import { usePlaylistStore, useTrackStore } from "../hooks";
import { STATUS } from '../utils';

export const Track = ({ token }) => {

  // REACT-REDUX HOOKS
  const { status } = useSelector(state => state.status);

  const { user } = useSelector(state => state.user);

  // REACT-REDUX CUSTOM HOOKS
  const { playlist, getRandomPlaylist } = usePlaylistStore({ token, user });

  const { track } = useTrackStore({ token, playlist, status });

  // VARIABLE
  /**
   * Indicates whether the 'track' object is not empty.
   * @type {Boolean}
   */
  const trackIsNotEmpty = Object.keys(track).length > 0;

  // EVENT
  const handleGenerateNewRandomTrack = () => getRandomPlaylist();


  return (

    <>

      <button disabled={status === STATUS.LOADING} onClick={handleGenerateNewRandomTrack}>RANDOM TRACK</button>

      { //TODO: skeleton loader
        status === STATUS.LOADING && (
          <p>Loading…</p>
        )
      }

      { //TODO: toast notification (or snackbar)
        status === STATUS.FAILED && (
          <p>ERROR!</p>
        )
      }

      {
        status !== STATUS.LOADING && trackIsNotEmpty && (
          <>

            <img src={track.artwork} alt='Album cover' title='Album cover' width='100' />

          </>
        )
      }

    </>

  );

};