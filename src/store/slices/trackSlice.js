import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    track: {},
    isLiked: false
};

export const trackSlice = createSlice({
    name: 'track',
    initialState,
    reducers: {
        setTrack: (state, { payload }) => {
            state.track = { ...payload };
        },
        setTrackLikeStatus: (state, { payload }) => {
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
    setTrackLikeStatus,
    resetTrackState
} = trackSlice.actions;