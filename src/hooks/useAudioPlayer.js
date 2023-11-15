import { useEffect, useRef, useState } from "react";
import { formatTime, updateElementStyle } from "../helpers";

export const useAudioPlayer = () => {

    // REACT HOOKS
    const [isPlaying, setIsPlaying] = useState(false);

    const [currentTime, setCurrentTime] = useState('00:00');

    const [duration, setDuration] = useState('00:00');

    const [hasEnded, setHasEnded] = useState(false);

    /**
     * A reference used to access and control the audio element.
     * @type {React.RefObject<HTMLAudioElement>}
     */
    const audioRef = useRef();

    /**
     * A reference used to access the input range element for tracking the duration of the audio track.
     * @type {React.RefObject<HTMLInputElement>}
     */
    const progressBarRef = useRef();

    /**
     * A reference used for scheduling and controlling animation frames to update the playback time progress continuously.
     * @type {React.RefObject<Number>}
     */
    const playbackAnimationRef = useRef();

    // FUNCTIONS
    /**
     * Toggles the playback state between playing and paused.
     * @function handlePlayback
     */
    const handlePlayback = () => setIsPlaying(prevState => !prevState); //!FUNC-HANDLEPLAYBACK

    /**
     * Callback function executed when the audio track has ended.
     * @function onEnded
     */
    const onEnded = () => {

        setIsPlaying(false);

        setHasEnded(true);

        // Resets playback to the beginning. //! It is not working after the first trigger.
        audioRef.current.currentTime = 0;

    }; //!FUNC-ONENDED

    /**
     * Callback function executed when the audio track's metadata is loaded.
     * @function onLoadedMetadata
     */
    const onLoadedMetadata = () => {

        // Sets the audio duration as the 'max' property of the input range element.
        progressBarRef.current.max = audioRef.current.duration;

        /**
         * The duration time in "mm:ss" format.
         * @type {String}
         */
        const formattedTime = formatTime(audioRef.current.duration);

        // Update the displayed duration time.
        setDuration(formattedTime);

    }; //!FUNC-ONLOADEDMETADATA

    /**
     * Updates the current time display in "mm:ss" format.
     * @function updateTimeProgress
     * @param {Number} time - The time value to be formatted and displayed.
     */
    const updateTimeProgress = (time) => {

        /**
         * The current time in "mm:ss" format.
         * @type {String}
         */
        const formattedTime = formatTime(time);

        // Update the current time display.
        setCurrentTime(formattedTime);

    }; //!FUNC-UPDATETIMEPROGRESS

    /**
     * Handles changes in the progress bar's value and updates the audio playback time accordingly.
     * 
     * This function sets the current playback time of the audio element to match the value of the progress bar,
     * and then updates the displayed time to reflect the change.
     * 
     * @function handleProgressBarChange
     */
    const handleProgressBarChange = () => {

        // Sets the current playback time as the 'currentTime' property of the audio element.
        audioRef.current.currentTime = progressBarRef.current.value;

        // Updates the displayed time.
        updateTimeProgress(audioRef.current.currentTime);

    }; //!FUNC-HANDLEPROGRESSBARCHANGE

    /**
     * Sets the width style for the progress on the range slider of the audio player based on the current audio time and duration.
     * @function setRangeProgressStyle
     */
    const setRangeProgressStyle = () => {

        /**
         * Calculates the progress width for the range slider of the audio player.
         * @type {Number}
         */
        const width = (progressBarRef.current.value / audioRef.current.duration) * 100;

        updateElementStyle(progressBarRef.current, '--range-progress', `${width}%`);

    }; //!FUNC-SETRANGEPROGRESSSTYLE

    /**
     * Animates the current time display and progress bar.
     * 
     * This function updates the current playback time on the progress bar element,
     * calls the 'updateTimeProgress' function to update the displayed time,
     * and schedules a request for the next frame to continuously update the time progress.
     * 
     * @function animateTimeProgress
     */
    const animateTimeProgress = () => {

        // Sets the current playback time as the 'value' property of the input range element.
        progressBarRef.current.value = audioRef.current.currentTime;

        // Updates the displayed time.
        updateTimeProgress(audioRef.current.currentTime);

        // Sets the width style for the progress on the range slider.
        setRangeProgressStyle();

        // Schedules a request for the next frame to update the time progress continuously.
        playbackAnimationRef.current = requestAnimationFrame(animateTimeProgress);

    }; //!FUNC-ANIMATETIMEPROGRESS

    useEffect(() => {

        console.log('ENTRO')

        if (isPlaying) {

            /**
             * Reset the track's state to its initial value if it has ended and the user plays the track again.
             * This ensures that icons are displayed correctly in the component.
             */
            if (hasEnded) setHasEnded(false);

            audioRef.current.play();

        } else {

            audioRef.current.pause();

        };

        // Animates the current time display and progress bar.
        animateTimeProgress();

        return () => {

            // Cancels the previously scheduled animation request.
            cancelAnimationFrame(playbackAnimationRef.current);

        };

    }, [isPlaying]);


    return {
        currentTime,
        duration,
        hasEnded,
        isPlaying,
        audioRef,
        progressBarRef,
        handlePlayback,
        onEnded,
        onLoadedMetadata,
        handleProgressBarChange
    };

};