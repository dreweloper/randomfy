import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for the playlist data.
 * @type {Object}
 * @prop {String} playlist_id - The Spotify ID of the playlist.
 * @prop {Number} total_tracks - The total number of tracks in the playlist.
 * @prop {Boolean} isFollowed - Indicates if the user is following the playlist with the specified ID.
 */
const initialState = {
    playlist_id: '',
    total_tracks: 0,
    isFollowed: false,
};

export const playlistSlice = createSlice({

    name: 'playlist',
    initialState,
    reducers: {
        setPlaylist: (state, { payload }) => {
            state.playlist_id = payload.playlist_id;
            state.total_tracks = payload.total_tracks;
            state.isFollowed = payload.isFollowed;
        },
        isPlaylistFollowed: (state, { payload }) => {
            state.isFollowed = payload;
        },
        resetPlaylistState: (state) => {
            state.playlist_id = '';
            state.total_tracks = 0;
            state.isFollowed = false;
        }
    }

});

export const {setPlaylist,
    isPlaylistFollowed,
    resetPlaylistState
} = playlistSlice.actions;