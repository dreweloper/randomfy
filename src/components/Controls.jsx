import { PauseIcon, PlayIcon } from '../components/icons';
//TODO: PropTypes
export const Controls = ({
    handlePlayback,
    hasEnded,
    isPlaying,
    trackPreview
}) => {

    return (

        <button onClick={handlePlayback} disabled={!trackPreview}>

            {hasEnded ? <PlayIcon /> : isPlaying ? <PauseIcon /> : <PlayIcon />}

        </button>

    );

};