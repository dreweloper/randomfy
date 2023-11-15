import { ProgressBar, Controls } from "./index";
import { useAudioPlayer } from "../../hooks";
import styles from '../../sass/components/Media/_AudioPlayer.module.scss';
//TODO: PropTypes
export const AudioPlayer = ({ isLoading, trackPreview }) => {

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
    } = useAudioPlayer(isLoading);


    return (

        <>

            <div className={styles.audioPlayer}>

                <audio src={trackPreview} onEnded={onEnded} onLoadedMetadata={onLoadedMetadata} ref={audioRef}></audio>

                <Controls {...{ handlePlayback, hasEnded, isLoading, isPlaying, trackPreview }} />

                <ProgressBar {...{ currentTime, duration, handleProgressBarChange, progressBarRef }} />

            </div>

        </>

    );

};