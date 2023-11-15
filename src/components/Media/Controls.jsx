import styles from '../../sass/components/Media/_Controls.module.scss';
//TODO: PropTypes
export const Controls = ({ handlePlayback, hasEnded, isLoading, isPlaying, trackPreview }) => {


    return (

        //TODO: RoundedButton
        <button
            className={styles.button}
            onClick={handlePlayback}
            disabled={!trackPreview || isLoading}
        >

            {
                (hasEnded || !isPlaying) ? (

                    <span className={`${styles.icon} material-symbols-rounded`}>
                        play_arrow
                    </span>

                ) : (

                    <span className={`${styles.icon} material-symbols-rounded`}>
                        pause
                    </span>
                )
            }

        </button>

    );

};