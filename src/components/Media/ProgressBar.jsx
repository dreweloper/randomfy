import styles from '../../sass/components/Media/_ProgressBar.module.scss';
//TODO: PropTypes
export const ProgressBar = ({ currentTime, duration, handleProgressBarChange, progressBarRef }) => {

    return (

        <div className={styles.progressBar}>

            <span className={styles.time}>{currentTime}</span>

            <input
                type='range'
                defaultValue='0'
                onChange={handleProgressBarChange}
                ref={progressBarRef}
            />

            <span className={styles.time}>{duration}</span>

        </div>

    );

};