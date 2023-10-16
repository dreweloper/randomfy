import { createSlice } from '@reduxjs/toolkit';

/**
 * @type {Object}
 * @prop {String} track_id - The Spotify ID for the track.
 * @prop {String} album_cover - The source URL of the album cover image.
 * @prop {String} name - The name of the track.
 * @prop {Array} artists - The artists who performed the track.
 * @prop {String | null} preview_url - A link to a 30 second preview (MP3 format) of the track. Can be 'null'.
 * @prop {Boolean} isLiked - Indicates whether the track is already saved in the current Spotify user's 'Your Music' library.
 */
const initialState = {
    track_id: '',
    album_cover: '',
    name: '',
    artists: [],
    preview_url: '',
    isLiked: false,
};

export const trackSlice = createSlice({
    name: 'track',
    initialState,
    reducers: {
        setTrack: (state, { payload }) => {
            state.track_id = payload.track_id;
            state.album_cover = payload.album_cover;
            state.name = payload.name;
            if (state.artists.length > 0) state.artists = []; // State reset after the first successful load
            payload.artists.forEach(artist => state.artists.push(artist.name)); // There can be more than one artist
            state.preview_url = payload.preview_url;
            state.isLiked = payload.isLiked;
        },
        isTrackLiked: (state, { payload }) => {
            state.isLiked = payload;
        },
        resetTrackState: (state) => {
            state.track_id = '';
            state.album_cover = '';
            state.name = '';
            state.artist = [];
            state.preview_url = '';
            if (state.isLiked) state.isLiked = false;
        },
    }
});

export const {
    setTrack,
    isTrackLiked,
    resetTrackState
} = trackSlice.actions;