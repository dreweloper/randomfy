import { createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../../utils';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {},
        userStatus: STATUS.IDLE
    },
    reducers: {
        setUserStatus: (state, { payload }) => {
            state.userStatus = payload;
        },
        // After login
        setUser: (state, { payload }) => {
            state.user = { ...payload };
            state.userStatus = STATUS.SUCCEEDED;
        },
        // Logout
        deleteUser: (state) => {
            state.user = {};
            state.userStatus = STATUS.IDLE;
        },
    }
});

export const { setUserStatus, setUser, deleteUser } = userSlice.actions;