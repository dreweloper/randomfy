import { configureStore } from '@reduxjs/toolkit';
import { playlistSlice, statusSlice, trackSlice, userSlice } from './slices';

export const store = configureStore({
    reducer: {
        playlist: playlistSlice.reducer,
        status: statusSlice.reducer,
        track: trackSlice.reducer,
        user: userSlice.reducer
    }
});