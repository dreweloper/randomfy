import { createSlice } from '@reduxjs/toolkit';

export const tracksSlice = createSlice({
    name: 'tracks',
    initialState: [],
    reducers: {
        addTrack: (state, { payload }) => {
            state.push(payload);
        }
    }
});

export const { addTrack } = tracksSlice.actions;