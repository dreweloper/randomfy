import { configureStore } from '@reduxjs/toolkit';
import { tracksSlice, userSlice } from './slices';

export const store = configureStore({
    reducer: {
        tracks: tracksSlice.reducer,
        user: userSlice.reducer
    }
});