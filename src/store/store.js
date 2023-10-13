import { configureStore } from '@reduxjs/toolkit';
import { statusSlice, tracksSlice, userSlice } from './slices';

export const store = configureStore({
    reducer: {
        status: statusSlice.reducer,
        tracks: tracksSlice.reducer,
        user: userSlice.reducer
    }
});