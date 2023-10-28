import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for the playlist data.
 * @type {Object}
 * @prop {String} playlist_id - The Spotify ID of the playlist.
 * @prop {Number} total_tracks - The total number of tracks in the playlist.
 * @prop {Boolean} isFollowed - Indicates if the user is following the playlist with the specified ID.
 * @prop {Boolean} isEmpty - Indicates whether the playlist data is empty.
 * @prop {Boolean} isDone - Indicates whether the process of retrieving a random playlist has been completed.
 */
const initialState = {
    playlist_id: '',
    total_tracks: 0,
    isFollowed: false,
    isEmpty: true,
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
            if (state.isEmpty) state.isEmpty = false; // Set to 'false' only on the first successful load.
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
            state.isFollowed = false;
            state.isEmpty = true;
            state.isDone = false;
        }
    }

});

export const {
    setPlaylist,
    isPlaylistFollowed,
    setPlaylistUndone,
    resetPlaylistState
} = playlistSlice.actions;