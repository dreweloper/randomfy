//TODO: PropTypes
export const Controls = ({ handlePlayback, hasEnded, isPlaying, trackPreview }) => {

    return (

        //TODO: RoundedButton
        <button onClick={handlePlayback} disabled={!trackPreview}>

            {
                hasEnded ? (

                    <span className="material-symbols-rounded">
                        play_arrow
                    </span>

                ) : (

                    isPlaying ? (

                        <span className="material-symbols-rounded">
                            pause
                        </span>

                    ) : (

                        <span className="material-symbols-rounded">
                            play_arrow
                        </span>

                    )
                )
            }

        </button>

    );

};