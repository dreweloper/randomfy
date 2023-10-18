import { useRef, useState } from "react";

export const useAudioPlayer = () => {

    // REACT HOOKS
    const [isPlaying, setIsPlaying] = useState(false);

    /**
     * A reference used to access and control the audio element.
     * @type {React.RefObject<HTMLAudioElement>}
     */
    const audioRef = useRef();

    // EVENT FUNCTIONS
    /**
     * Handles audio playback control.
     * If not playing, it plays the audio; otherwise, it pauses it.
     */
    const handleControls = () => !isPlaying ? audioRef.current.play() : audioRef.current.pause();

    // Callback function executed when the audio starts playing.
    const onPlay = () => setIsPlaying(true);

    // Callback function executed when the audio is paused.
    const onPause = () => setIsPlaying(false);

    // Callback function executed when the audio track has ended.
    const onEnded = () => setIsPlaying(false);

    return {
        isPlaying,
        audioRef,
        handleControls,
        onPlay,
        onPause,
        onEnded
    };

};