import { useEffect } from "react";
import { useSelector } from "react-redux";
import { usePlaylistStore, useTrackStore } from "../hooks";
import { STATUS } from '../utils';

export const Track = ({ token }) => {

  // REACT-REDUX HOOKS
  const { status } = useSelector(state => state.status);
  const { track } = useSelector(state => state.track);
  const { user } = useSelector(state => state.user);

  // REACT-REDUX CUSTOM HOOKS
  const { playlist, getRandomPlaylist } = usePlaylistStore({ token, user });

  const { getRandomTrack } = useTrackStore(token);

  // VARIABLES
  /**
   * @type {Object}
   * @prop {String} playlist_id - The Spotify ID of the playlist.
   * @prop {Number} total_tracks - The total number of tracks in the playlist with the provided ID.
   */
  const { playlist_id, total_tracks } = playlist;

  /**
   * Indicates whether the 'track' object is  empty.
   * @type {Boolean}
   */
  const trackIsEmpty = Object.keys(track).length === 0;

  // REACT HOOK
  useEffect(() => {

    // The second conditional avoids unnecessary re-renders (e.g., during navigation with web browser arrows)
    if (playlist.isDone && status === STATUS.LOADING) getRandomTrack(playlist_id, total_tracks);

  }, [playlist]);


  return (

    <>

      <button disabled={status === STATUS.LOADING} onClick={() => { getRandomPlaylist() }}>RANDOM TRACK</button>

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

      { // The 'track' object is not empty
        status !== STATUS.LOADING && !trackIsEmpty && (
          <>

            <img src={track.artwork} alt='Album cover' title='Album cover' width='100' />

          </>
        )
      }

    </>

  );

};