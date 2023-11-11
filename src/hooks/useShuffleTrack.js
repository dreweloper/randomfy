import { useDispatch } from "react-redux";
import { useAuth } from "./index";
import { setPlaylistUndone, setStatus } from "../store/slices";
import { STATUS } from "../utils";

export const useShuffleTrack = (token) => {
    
    // REACT-REDUX HOOK
    const dispatch = useDispatch();

    // CUSTOM HOOKS
    const { requestRefreshedAccessToken } = useAuth();


    const handleAnotherShuffleTrack = async () => {

        try {

            dispatch(setStatus(STATUS.LOADING));

            if (token) {

                dispatch(setPlaylistUndone());

            } else {

                const response = await requestRefreshedAccessToken();

                if (response.ok) {

                    setTimeout(() => {

                        dispatch(setPlaylistUndone());

                    }, 500); // To ensure that the refreshed access token is stored in cookies before trying to generate a new random track.

                };

            };

        } catch (error) {

            console.error(error);

            dispatch(setStatus(STATUS.FAILED));

        };

    }; //!FUNC-HANDLEANOTHERSHUFFLETRACK


    return { handleAnotherShuffleTrack };

};