import { createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../../utils';

/**
 * @type {Object}
 * @prop {String} status - The process status of the core app feature: generating a random track from a user's random playlist. Can be one of the following: 'idle', 'loading', 'succeed', or 'failed'.
 */
const initialState = { status: STATUS.IDLE };

export const processSlice = createSlice({

    name: 'process',
    initialState,
    reducers: {
        setStatus: (state, { payload }) => {
            state.status = payload;
        }
    }

});

export const { setStatus } = processSlice.actions;