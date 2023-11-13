import { ProgressBar, Controls } from "./index";
import { Toast } from "../Notifications";
import { useAudioPlayer } from "../../hooks";
import styles from '../../sass/components/Media/_AudioPlayer.module.scss';
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

        <>

            <div className={styles.audioPlayer}>

                <audio src={trackPreview} onEnded={onEnded} onLoadedMetadata={onLoadedMetadata} ref={audioRef}></audio>

                <Controls {...{ handlePlayback, hasEnded, isPlaying, trackPreview }} />

                <ProgressBar {...{ currentTime, duration, handleProgressBarChange, progressBarRef }} />

            </div>

            {
                !trackPreview && (

                    <Toast
                        type={'warning'}
                        text={'Track preview is not available.'}
                    />

                )
            }

        </>

    );

};