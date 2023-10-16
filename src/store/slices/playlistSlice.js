import { createSlice } from '@reduxjs/toolkit';

/**
 * @type {Object}
 * @prop {String} playlist_id - The Spotify ID of the playlist.
 * @prop {Number} total_tracks - Number of tracks in the playlist.
 * @prop {Boolean} isFollowed - Indicates whether the user follows the playlist with the provided ID.
 * @prop {Boolean} isDone - Indicates whether the process is completed.
 */
const initialState = {
    playlist_id: '',
    total_tracks: 0,
    isFollowed: false,
    isDone: false
};

export const playlistSlice = createSlice({

    name: 'playlist',
    initialState,
    reducers: {
        setPlaylist: (state, { payload }) => {
            state.playlist_id = payload.playlist_id;
            state.total_tracks = payload.total_tracks;
            state.isFollowed = payload.isFollowed;
            state.isDone = true;
        },
        isPlaylistFollowed: (state, { payload }) => {
            state.isFollowed = payload;
        },
        setPlaylistUndone: (state) => {
            state.isDone = false;
        },
        resetPlaylistState: (state) => {
            state.playlist_id = '';
            state.total_tracks = 0;
            if (state.isFollowed) state.isFollowed = false;
            if (state.isDone) state.isDone = false;
        }
    }

});

export const {
    setPlaylist,
    isPlaylistFollowed,
    setPlaylistUndone,
    resetPlaylistState
} = playlistSlice.actions;