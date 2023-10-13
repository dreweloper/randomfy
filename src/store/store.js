import { configureStore } from '@reduxjs/toolkit';
import { playlistSlice, statusSlice, tracksSlice, userSlice } from './slices';

export const store = configureStore({
    reducer: {
        playlist: playlistSlice.reducer,
        status: statusSlice.reducer,
        tracks: tracksSlice.reducer,
        user: userSlice.reducer
    }
});