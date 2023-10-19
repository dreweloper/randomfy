import { useRef, useState } from "react";

export const useAudioPlayer = () => {

    // REACT HOOKS
    const [currentTime, setCurrentTime] = useState('00:00');

    const [duration, setDuration] = useState('00:00');

    const [isPlaying, setIsPlaying] = useState(false);

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

    // FUNCTIONS
    /**
     * Formats a number of seconds as a string in the "mm:ss" format.
     * @param {Number} time - The number of seconds to format.
     * @returns {String} A string representation of the seconds in "mm:ss" format.
     */
    const formatSeconds = (time) => {

        /**
         * The integer part of the time, obtained by removing any fractional digits.
         * @type {Number}
         */
        const seconds = Math.trunc(time);

        return seconds < 10 ? `00:0${seconds}` : `00:${seconds}`;

    };

    // EVENTS
    /**
     * Handles audio playback control.
     * If not playing, it plays the audio; otherwise, it pauses it.
     */
    const handlePlayback = () => !isPlaying ? audioRef.current.play() : audioRef.current.pause();

    /**
     * Callback function executed when the audio starts playing.
     * @function onPlay
     */
    const onPlay = () => setIsPlaying(true);

    /**
     * Callback function executed when the audio is paused.
     * @function onPause
     */
    const onPause = () => setIsPlaying(false);

    /**
     * Callback function executed when the audio track has ended.
     * @function onEnded
     */
    const onEnded = () => setIsPlaying(false);

    /**
     * Callback function executed when the audio track's metadata is loaded.
     * @function onLoadedMetadata
     * @param {Event} event - The event object containing playback time information.
     */
    const onLoadedMetadata = (event) => {

        // Sets the audio duration as the 'max' property of the input range element.
        progressBarRef.current.max = event.target.duration;

        /**
         * The seconds in "mm:ss" format.
         * @type {String}
         */
        const seconds = formatSeconds(event.target.duration);

        setDuration(seconds);

    };

    /**
     * Callback function executed when the audio time updates during playback.
     * @function onTimeUpdate
     * @param {Event} event - The event object containing playback time information.
     */
    const onTimeUpdate = (event) => {

        // Sets the current playback time as the 'value' property of the input range element.
        progressBarRef.current.value = event.target.currentTime;

        /**
         * The seconds in "mm:ss" format.
         * @type {String}
         */
        const seconds = formatSeconds(event.target.currentTime);

        setCurrentTime(seconds);

    };


    return {
        currentTime,
        duration,
        isPlaying,
        audioRef,
        progressBarRef,
        handlePlayback,
        onEnded,
        onLoadedMetadata,
        onPause,
        onPlay,
        onTimeUpdate
    };

};