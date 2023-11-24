import { createSlice } from '@reduxjs/toolkit';
import { MESSAGE, STATUS } from '../../utils';

/**
 * Initial state for the app process status.
 * @type {Object}
 * @prop {String} status - The process status of the core app feature: generating a random track from a user's random playlist. Can be one of the following: 'idle', 'loading', 'succeed', or 'failed'.
 * @prop {null|Number} code - The HTTP response status code or null if it does not exists.
 * @prop {String} message - Error message in case the process fails.
 */
const initialState = {
    status: STATUS.IDLE,
    code: null,
    message: ''
};

export const processSlice = createSlice({

    name: 'process',
    initialState,
    reducers: {
        setStatus: (state, { payload }) => {
            state.status = payload.status;
            if (!payload.code) {
                // A non-fetch-related error will dispatch a message (conditional: 'payload.message' is not null/undefined).
                if (payload.message) state.message = payload.message;
            } else {
                // Fetch errors cases.
                state.code = payload.code;
                if (payload.code === 400) state.message = MESSAGE.CLIENT_ERROR;
                if (payload.code === 500) state.message = MESSAGE.SERVER_ERROR;
            };
        },
        resetStatus: (state) => {
            state.status = STATUS.IDLE;
            state.code = null;
            state.message = '';
        }
    }

});

export const { setStatus, resetStatus } = processSlice.actions;