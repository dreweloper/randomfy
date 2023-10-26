import { Button } from '../Buttons';
import { PauseIcon, PlayIcon } from '../Icons';
//TODO: PropTypes
export const Controls = ({ handlePlayback, hasEnded, isPlaying, trackPreview }) => {

    return (

        //TODO: RoundedButton
        <Button onClick={handlePlayback} disabled={!trackPreview}>

            {hasEnded ? <PlayIcon /> : isPlaying ? <PauseIcon /> : <PlayIcon />}

        </Button>

    );

};