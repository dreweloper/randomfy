import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {}
    },
    reducers: {
        setUser: (state, { payload }) => {
            state.user = { ...payload }
        }
    }
});

export const { setUser } = userSlice.actions;