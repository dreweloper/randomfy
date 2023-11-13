import { useSelector } from 'react-redux';
import { STATUS } from '../../utils';
import styles from '../../sass/components/Media/_Controls.module.scss';
//TODO: PropTypes
export const Controls = ({ handlePlayback, hasEnded, isPlaying, trackPreview }) => {

    const status = useSelector(state => state.process.status);


    return (

        //TODO: RoundedButton
        <button
            className={styles.button}
            onClick={handlePlayback}
            disabled={!trackPreview || status === STATUS.LOADING}
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