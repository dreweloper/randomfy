import { useAudioPlayer } from "../hooks";
//TODO: PropTypes
export const AudioPlayer = ({ trackPreview }) => {

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
                src={trackPreview}
                onEnded={onEnded}
                onLoadedMetadata={onLoadedMetadata}
                onPause={onPause}
                onPlay={onPlay}
                onTimeUpdate={onTimeUpdate}
                ref={audioRef}
            ></audio>

            <button onClick={handlePlayback} disabled={!trackPreview}>

                {isPlaying ? 'Pause' : 'Play'}

            </button>

            <div className="progressBar">

                <span>{currentTime}</span>

                <input type="range" defaultValue='0' ref={progressBarRef} />

                <span>{duration}</span>

            </div>

        </section>

    );

};