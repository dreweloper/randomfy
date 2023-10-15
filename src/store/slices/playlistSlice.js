import { createSlice } from '@reduxjs/toolkit';

/**
 * @type {Object}
 * @prop {String} playlist_id - The Spotify ID of the playlist.
 * @prop {Number} total_tracks - Number of tracks in the playlist.
 * @prop {Boolean} isFollowed - Indicates whether the user follows the playlist with the provided ID.
 * @prop {Boolean} isDone - Indicates whether the process is completed.
 */
const initialState = {
    playlist: {},
    isFollowed: false,
    isDone: false
};

export const playlistSlice = createSlice({

    name: 'playlist',
    initialState,
    reducers: {
        setPlaylist: (state, { payload }) => {
            state.playlist = {
                playlist_id: payload.playlist_id,
                total_tracks: payload.total_tracks
            };
            state.isFollowed = payload.isFollowed;
            state.isDone = true;
        },
        isPlaylistFollowed: (state, { payload }) => {
            state.isFollowed = payload;
        },
        isPlaylistDone: (state, { payload }) => {
            state.isDone = payload;
        },
        resetPlaylistState: (state) => {
            state.playlist = {};
            state.isFollowed = false;
            state.isDone = false;
        }
    }

});

export const {
    setPlaylist,
    isPlaylistFollowed,
    isPlaylistDone,
    resetPlaylistState
} = playlistSlice.actions;