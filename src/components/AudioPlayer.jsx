import { useAudioPlayer } from "../hooks";
import { ProgressBar, Controls } from "./index";
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

            <audio src={trackPreview} onEnded={onEnded} onLoadedMetadata={onLoadedMetadata} ref={audioRef}></audio>

            <Controls {...{ handlePlayback, hasEnded, isPlaying, trackPreview }} />

            <ProgressBar {...{ currentTime, duration, handleProgressBarChange, progressBarRef }} />

        </section>

    );

};