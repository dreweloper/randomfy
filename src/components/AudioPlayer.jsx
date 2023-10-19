import { useSelector } from "react-redux";
import { useAudioPlayer } from "../hooks";

export const AudioPlayer = () => {

    // REACT-REDUX HOOK
    const { preview_url } = useSelector(state => state.track);

    // CUSTOM HOOK
    const {
        audioRef,
        progressBarRef,
        currentTime,
        duration,
        isPlaying,
        handlePlayback,
        onEnded,
        onLoadedMetadata,
        onPause,
        onPlay,
        onTimeUpdate
    } = useAudioPlayer();


    return (

        <section className="audioPlayer">

            <audio
                src={preview_url}
                onEnded={onEnded}
                onLoadedMetadata={onLoadedMetadata}
                onPause={onPause}
                onPlay={onPlay}
                onTimeUpdate={onTimeUpdate}
                ref={audioRef}
            ></audio>

            <button onClick={handlePlayback} disabled={!preview_url}>

                {isPlaying ? 'Pause' : 'Play'}

            </button>

            <div className="progressBar">

                <span>{currentTime}</span>

                <input type="range" defaultValue='0' disabled={true} ref={progressBarRef} />

                <span>{duration}</span>

            </div>

        </section>

    );

};