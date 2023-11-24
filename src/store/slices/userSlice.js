import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state the user data.
 * @type {Object}
 * @prop {String} id - The Spotify user ID for the user.
 * @prop {String | null} display_name - The name displayed on the user's profile. Can be 'null' if it is not available.
 * @prop {String} avatar - The user's profile image.
 * @prop {Boolean} isLogged - Indicates whether the user is logged in.
 * @prop {Boolean} isEmpty - Indicates whether the user data is not empty.
 */
const initialState = {
    id: '',
    display_name: '',
    avatar: '',
    isLogged: false,
    isEmpty: true
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // After the login is successful.
        isUserLogged: (state, { payload }) => {
            state.isLogged = payload;
        },
        setUser: (state, { payload }) => {
            state.id = payload.id;
            state.display_name = payload.display_name;
            state.avatar = payload.avatar;
            state.isEmpty = false;
        },
        // Logout.
        resetUserState: (state) => {
            state.id = '';
            state.display_name = '';
            state.avatar = '';
            state.isLogged = false;
            state.isError = false;
            state.isEmpty = true;
        },
    }
});

export const {
    isUserLogged,
    setUser,
    resetUserState
} = userSlice.actions;