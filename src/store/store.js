import { configureStore } from '@reduxjs/toolkit';
import { playlistSlice, processSlice, trackSlice, userSlice } from './slices';

export const store = configureStore({
    reducer: {
        playlist: playlistSlice.reducer,
        process: processSlice.reducer,
        track: trackSlice.reducer,
        user: userSlice.reducer
    }
});