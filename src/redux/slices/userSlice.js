import { createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../../utils';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {},
        status: STATUS.IDLE
    },
    reducers: {
        setStatus: (state, { payload }) => {
            state.status = payload;
        },
        // After login
        setUser: (state, { payload }) => {
            state.user = { ...payload };
            state.status = STATUS.SUCCEEDED;
        },
        // Logout
        deleteUser: (state) => {
            state.user = {};
            state.status = STATUS.IDLE;
        },
    }
});

export const { setStatus, setUser, deleteUser } = userSlice.actions;