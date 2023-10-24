import { Button } from './buttons';
import { PauseIcon, PlayIcon } from './icons';
//TODO: PropTypes
export const Controls = ({
    handlePlayback,
    hasEnded,
    isPlaying,
    trackPreview
}) => {

    return (

        <Button onClick={handlePlayback} disabled={!trackPreview}>

            {hasEnded ? <PlayIcon /> : isPlaying ? <PauseIcon /> : <PlayIcon />}

        </Button>

    );

};