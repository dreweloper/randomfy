import { createSlice } from '@reduxjs/toolkit';

/**
 * @type {Object}
 * @prop {Object} track - Information about the track.
 * @prop {Boolean} isLiked - Indicates whether the track is already saved in the current Spotify user's 'Your Music' library.
 */
const initialState = {
    track: {},
    isLiked: false,
};

export const trackSlice = createSlice({
    name: 'track',
    initialState,
    reducers: {
        setTrack: (state, { payload }) => {
            state.track = { ...payload };
        },
        isTrackLiked: (state, { payload }) => {
            state.isLiked = payload;
        },
        resetTrackState: (state) => {
            state.track = {};
            state.isLiked = false;
        },
    }
});

export const {
    setTrack,
    isTrackLiked,
    resetTrackState
} = trackSlice.actions;