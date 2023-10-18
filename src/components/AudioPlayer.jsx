import { useRef, useState } from "react";
import { useSelector } from "react-redux";

export const AudioPlayer = () => {

    // REACT-REDUX HOOK
    const { preview_url } = useSelector(state => state.track);

    // REACT HOOKS
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef();

    // EVENTS
    const handleControls = () => !isPlaying ? audioRef.current.play() : audioRef.current.pause();

    // After 'pause' method ('handleControls').
    const onPause = () => setIsPlaying(false);

    // After 'play' method ('handleControls').
    const onPlay = () => setIsPlaying(true);

    // Reset state once the track has ended.
    const onEnded = () => setIsPlaying(false);


    return (

        <section>

            <audio src={preview_url} onEnded={onEnded} onPause={onPause} onPlay={onPlay} ref={audioRef}></audio>

            <button onClick={handleControls} disabled={!preview_url}>

                {isPlaying ? 'Pause' : 'Play'}

            </button>

        </section>

    );

};