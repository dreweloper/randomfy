import { useAudioPlayer } from "../hooks";
import { PauseIcon, PlayIcon } from '../components/icons';
//TODO: PropTypes
export const AudioPlayer = ({ trackPreview }) => {

    // CUSTOM HOOK
    const {
        audioRef,
        progressBarRef,
        currentTime,
        duration,
        hasEnded,
        isPlaying,
        handlePlayback,
        onEnded,
        onLoadedMetadata,
        handleProgressBarChange
    } = useAudioPlayer();


    return (

        <section className="audioPlayer">

            <audio
                src={trackPreview}
                onEnded={onEnded}
                onLoadedMetadata={onLoadedMetadata}
                ref={audioRef}
            ></audio>

            <button onClick={handlePlayback} disabled={!trackPreview}>

                { hasEnded ? <PlayIcon /> : isPlaying ? <PauseIcon /> : <PlayIcon />}

            </button>

            <div className="progressBar">

                <span>{currentTime}</span>

                <input
                    type="range"
                    defaultValue='0'
                    onChange={handleProgressBarChange}
                    ref={progressBarRef}
                />

                <span>{duration}</span>

            </div>

        </section>

    );

};