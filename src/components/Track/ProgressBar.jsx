//TODO: PropTypes
export const ProgressBar = ({ currentTime, duration, handleProgressBarChange, progressBarRef }) => {

    return (

        <div className='progressBar'>

            <span className='time'>{currentTime}</span>

            <input
                type='range'
                defaultValue='0'
                onChange={handleProgressBarChange}
                ref={progressBarRef}
            />

            <span className='time'>{duration}</span>

        </div>

    );

};