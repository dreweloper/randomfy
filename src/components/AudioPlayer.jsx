import { useSelector } from "react-redux";
import { useAudioPlayer } from "../hooks";

export const AudioPlayer = () => {

    // REACT-REDUX HOOK
    const { preview_url } = useSelector(state => state.track);

    // CUSTOM HOOK
    const { audioRef, isPlaying, handleControls, onEnded, onPause, onPlay } = useAudioPlayer();


    return (

        <section>

            <audio src={preview_url} onEnded={onEnded} onPause={onPause} onPlay={onPlay} ref={audioRef}></audio>

            <button onClick={handleControls} disabled={!preview_url}>

                {isPlaying ? 'Pause' : 'Play'}

            </button>

        </section>

    );

};