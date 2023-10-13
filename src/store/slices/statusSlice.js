import { createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../../utils';

export const statusSlice = createSlice({

    name: 'status',
    initialState: STATUS.IDLE, // 'idle' || 'loading' || 'succeed' || 'failed'
    reducers: {
        setStatus: (state, { payload }) => {
            state = payload;
        }
    }

});

export const { setStatus } = statusSlice.actions;