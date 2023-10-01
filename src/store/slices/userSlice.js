import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {},
        isUserLoading: false,
        isUserError: false
    },
    reducers: {
        startLoading: (state) => {
            state.isUserLoading = true;
        },
        // After login
        setUser: (state, { payload }) => {
            state.user = { ...payload };
            state.isUserLoading = false;
        },
        setError: (state) => {
            state.isUserError = true;
            state.isUserLoading = false;
        },
        // Logout
        deleteUser: (state) => {
            state.user = {};
        },
    }
});

export const {
    startLoading,
    setUser,
    setError,
    deleteUser
} = userSlice.actions;