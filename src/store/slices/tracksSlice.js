import { createSlice } from '@reduxjs/toolkit';

export const tracksSlice = createSlice({
    name: 'tracks',
    initialState: {
        tracks: [],
        isTrackLoading: false,
        isTrackError: false
    },
    reducers: {
        startTrackLoading: (state) => {
            state.isTrackLoading = true;
        },
        addTrack: (state, { payload }) => {
            state.tracks.push(payload);
            state.isTrackLoading = false;
        },
        setTrackError: (state) => {
            state.isTrackError = true;
            state.isTrackLoading = false;
        },
        removeTracks: (state) => {
            if(state.tracks.length > 0) state.tracks = [];
            if(state.isTrackLoading) state.isTrackLoading = false;
            if(state.isTrackError) state.isTrackError = false;
        },
    }
});

export const {
    startTrackLoading,
    addTrack,
    setTrackError,
    removeTracks
} = tracksSlice.actions;