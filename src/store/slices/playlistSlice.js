import { createSlice } from '@reduxjs/toolkit';

/**
 * @type {Object}
 * @prop {String} playlist_id - The Spotify ID of the playlist.
 * @prop {Boolean} isFollowed - Indicates whether the user follows the playlist with the provided ID.
 */
const initialState = {
    playlist_id: '',
    isFollowed: false
};

export const playlistSlice = createSlice({

    name: 'playlist',
    initialState,
    reducers: {
        setPlaylistId: (state, { payload }) => {
            state.playlist_id = payload;
        },
        setPlaylistFollowStatus: (state, { payload }) => {
            state.isFollowed = payload;
        },
        resetPlaylistState: (state) => {
            state = initialState;
        }
    }

});

export const {
    setPlaylistId,
    setPlaylistFollowStatus,
    resetPlaylistState
} = playlistSlice.actions;