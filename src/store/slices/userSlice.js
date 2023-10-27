import { createSlice } from '@reduxjs/toolkit';

/**
 * @type {Object}
 * @prop {String} id - The Spotify user ID for the user.
 * @prop {String | null} display_name - The name displayed on the user's profile. 'null' if not available.
 * @prop {String} avatar - The user's profile image.
 * @prop {Boolean} isLoading - Indicates whether user data is currently being loaded.
 * @prop {Boolean} isError - Indicates whether an error has occurred while loading user data.
 * @prop {Boolean} isEmpty - Indicates whether the user is not empty.
 */
const initialState = {
    id: '',
    display_name: '',
    avatar: '',
    isLoading: false,
    isError: false,
    isEmpty: true
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.isLoading = true;
        },
        // After the login is successful
        setUser: (state, { payload }) => {
            state.id = payload.id;
            state.display_name = payload.display_name;
            state.avatar = payload.avatar;
            state.isEmpty = false;
            state.isLoading = false;
        },
        setError: (state) => {
            state.isError = true;
            state.isLoading = false;
        },
        // Logout (state reset)
        deleteUser: (state) => {
            state.id = '';
            state.display_name = '';
            state.avatar = '';
            if (state.isLoading) state.isLoading = false;
            if (state.isError) state.isError = false;
            if (!state.isEmpty) state.isEmpty = true;
        },
    }
});

export const {
    startLoading,
    setUser,
    setError,
    deleteUser
} = userSlice.actions;