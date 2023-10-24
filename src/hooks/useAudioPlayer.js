import { useEffect, useRef, useState } from "react";
import { formatSeconds } from "../helpers";

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

    // FUNCTIONS
    /**
     * Handles audio playback control.
     * @function handlePlayback
     */
    const handlePlayback = () => setIsPlaying(prevState => !prevState);

    /**
     * Callback function executed when the audio track has ended.
     * @function onEnded
     */
    const onEnded = () => {

        setIsPlaying(false);

        setHasEnded(true);

        // Resets playback to the beginning.
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
         * The seconds in "mm:ss" format.
         * @type {String}
         */
        const seconds = formatSeconds(audioRef.current.duration);

        setDuration(seconds);

    }; //!FUNC-ONLOADEDMETADATA

    /**
     * Callback function executed when the audio time updates during playback.
     * @function onTimeUpdate
     */
    const onTimeUpdate = () => {

        // Sets the current playback time as the 'value' property of the input range element.
        progressBarRef.current.value = audioRef.current.currentTime;

        /**
         * The seconds in "mm:ss" format.
         * @type {String}
         */
        const seconds = formatSeconds(audioRef.current.currentTime);

        setCurrentTime(seconds);

    }; //!FUNC-ONTIMEUPDATE

    const handleProgressBarChange = () => {

        // Sets the current playback time as the 'currentTime' property of the audio element.
        audioRef.current.currentTime = progressBarRef.current.value;

        /**
         * The seconds in "mm:ss" format.
         * @type {String}
         */
        const seconds = formatSeconds(progressBarRef.current.value);

        setCurrentTime(seconds);

    }; //!FUNC-HANDLEPROGRESSBARCHANGE

    useEffect(() => {

        if (isPlaying) {

            audioRef.current.play();

            // Resets the state to its initial value so the icons can be displayed correctly.
            if (hasEnded) setHasEnded(false);

        } else {

            audioRef.current.pause();

        };

        const intervalId = isPlaying && requestAnimationFrame(() => {

            const audioElement = audioRef.current;

            if (audioElement) {

                const currentTime = audioElement.currentTime;

                const formattedTime = formatSeconds(currentTime);

                setCurrentTime(formattedTime);

                progressBarRef.current.value = currentTime;

            };

        });

        return () => {

            cancelAnimationFrame(intervalId);

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
        onTimeUpdate,
        handleProgressBarChange
    };

};