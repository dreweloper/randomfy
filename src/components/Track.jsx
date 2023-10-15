import { useCookies } from 'react-cookie';
import { useSelector } from "react-redux";
import { STATUS } from '../utils';
import { useEffect } from "react";
import { usePlaylistStore, useTrackStore } from "../hooks";

export const Track = () => {

  // REACT-REDUX HOOKS
  const playlist = useSelector(state => state.playlist);

  const { track } = useSelector(state => state.track);

  // REACT-COOKIE
  const [cookies] = useCookies([]);

  // REACT-REDUX HOOKS
  const { status } = useSelector(state => state.status);

  // CUSTOM HOOKS
  const { getRandomPlaylist } = usePlaylistStore(cookies.access_token);

  const { getRandomTrack } = useTrackStore(cookies.access_token);

  // REACT HOOK
  useEffect(() => {

    const playlistIsEmpty = playlist.playlist_id.length === 0;

    if (playlistIsEmpty) getRandomPlaylist();

  }, []);

  useEffect(() => {

    const playlistIsNotEmpty = playlist.playlist_id.length > 0;

    const trackIsEmpty = Object.keys(track).length === 0;

    if (playlistIsNotEmpty && trackIsEmpty) getRandomTrack();

  }, [playlist]);


  return (

    <>

      {
        status === STATUS.LOADING && (
          <p>Loading…</p>
        )
      }

      {
        status === STATUS.FAILED && (
          <p>ERROR!</p>
        )
      }

      {
        status !== STATUS.LOADING && Object.keys(track).length > 0 && (
          <article id={track.track_id}>

            <div>
              <img src={track.artwork} alt='Album cover' title='Album cover' width='100' />
            </div>

            <h2>{track.name}</h2>

            <h2>{track.artist}</h2>

            <p>{track.preview_url}</p>

          </article>
        )
      }

    </>

  );

};