import { createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../../utils';

/**
 * @type {Object}
 * @prop {String} status - The current process status, which can be one of the following: 'idle', 'loading', 'succeed', or 'failed'.
 */
const initialState = { status: STATUS.IDLE };

export const statusSlice = createSlice({

    name: 'status',
    initialState,
    reducers: {
        setStatus: (state, { payload }) => {
            state.status = payload;
        }
    }

});

export const { setStatus } = statusSlice.actions;