import styles from '../../sass/components/Media/_ProgressBar.module.scss';
//TODO: PropTypes
export const ProgressBar = ({ currentTime, duration, handleProgressBarChange, progressBarRef }) => {

    return (

        <div className={styles.progressBar}>

            <time
                className={styles.time}
                dateTime='mm:ss'
            >
                {currentTime}
            </time>

            <input
                type='range'
                defaultValue='0'
                onChange={handleProgressBarChange}
                ref={progressBarRef}
            />

            <time
                className={styles.time}
                dateTime='mm:ss'
            >
                {duration}
            </time>

        </div>

    );

};