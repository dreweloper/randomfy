import { createSlice } from '@reduxjs/toolkit';

/**
 * @type {Object}
 * @prop {Object} track - Information about the track.
 * @prop {Boolean} isLiked - Indicates whether the track is already saved in the current Spotify user's 'Your Music' library.
 * @prop {Boolean} isDone - Indicates whether the process is completed.
 */
const initialState = {
    track: {},
    isLiked: false,
    isDone: false
};

export const trackSlice = createSlice({
    name: 'track',
    initialState,
    reducers: {
        setTrack: (state, { payload }) => {
            state.track = { ...payload };
            state.isDone = true;
        },
        setTrackLikeStatus: (state, { payload }) => {
            state.isLiked = payload;
        },
        resetTrackState: (state) => {
            state.track = {};
            state.isLiked = false;
            state.isDone = false;
        },
    }
});

export const {
    setTrack,
    setTrackLikeStatus,
    resetTrackState
} = trackSlice.actions;