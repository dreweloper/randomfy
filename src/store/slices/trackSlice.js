import { createSlice } from '@reduxjs/toolkit';

/**
 * @type {Object}
 * @prop {String} track_id - The Spotify ID for the track.
 * @prop {String} album_cover - The source URL of the album cover image.
 * @prop {String} name - The name of the track.
 * @prop {String} artists - The artists who performed the track.
 * @prop {String} album - The name of the album.
 * @prop {String} track_url - 
 * @prop {String | null} preview_url - A link to a 30 second preview (MP3 format) of the track. Can be 'null'.
 * @prop {Boolean} isLiked - Indicates whether the track is already saved in the current Spotify user's 'Your Music' library.
 * @prop {Boolean} isEmpty - Indicates whether the track is empty.
 */
const initialState = {
    track_id: '',
    artwork: '',
    name: '',
    artists: '',
    album: '',
    track_url: '',
    preview_url: '',
    isLiked: false,
    isEmpty: true
};

export const trackSlice = createSlice({
    name: 'track',
    initialState,
    reducers: {
        setTrack: (state, { payload }) => {
            state.track_id = payload.track_id;
            state.artwork = payload.artwork;
            state.name = payload.name;
            state.artists = payload.artists;
            state.album = payload.album;
            state.track_url = payload.track_url;
            state.preview_url = payload.preview_url;
            state.isLiked = payload.isLiked;
            if (state.isEmpty) state.isEmpty = false; // Ensures that the track is displayed only when it is not empty.
        },
        isTrackLiked: (state, { payload }) => {
            state.isLiked = payload;
        },
        resetTrackState: (state) => {
            state.track_id = '';
            state.artwork = '';
            state.name = '';
            state.artist = '';
            state.album = '';
            state.track_url = '';
            state.preview_url = '';
            if (state.isLiked) state.isLiked = false;
            if (!state.isEmpty) state.isEmpty = true;
        },
    }
});

export const {
    setTrack,
    isTrackLiked,
    resetTrackState
} = trackSlice.actions;