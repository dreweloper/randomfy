import { createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../../utils';

/**
 * Initial state for the app process status.
 * @type {Object}
 * @prop {String} status - The process status of the core app feature: generating a random track from a user's random playlist. Can be one of the following: 'idle', 'loading', 'succeed', or 'failed'.
 * @prop {String} message - Error message in case the process fails.
 */
const initialState = {
    status: STATUS.IDLE,
    message: ''
};

export const processSlice = createSlice({

    name: 'process',
    initialState,
    reducers: {
        setStatus: (state, { payload }) => {
            state.status = payload.status;
            if (payload.message) state.message = payload.message; // Only when the process fails.
        },
        resetStatus: (state) => {
            state.status = STATUS.IDLE;
            state.message = '';
        }
    }

});

export const { setStatus, resetStatus } = processSlice.actions;