import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for the track data.
 * @type {Object}
 * @prop {String} track_id - The Spotify ID for the track.
 * @prop {String} artwork - The source URL of the cover art for the album.
 * @prop {String} name - The name of the track.
 * @prop {String} artists - The artists who performed the track.
 * @prop {String} album - The name of the album.
 * @prop {String} track_url - The Spotify URL for the track.
 * @prop {String | null} preview_url - A link to a 30 second preview (MP3 format) of the track. Can be 'null' if it is not available.
 * @prop {Boolean} isLiked - Indicates whether the track is saved in the current Spotify user's 'Your Music' library.
 * @prop {Boolean} isEmpty - Indicates whether the track data is empty.
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
    isEmpty: true,
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
            if (state.isEmpty) state.isEmpty = false; // Set to 'false' only on the first successful load to conditionally render 'TrackCard' when 'track' state props are not empty.
        },
        isTrackLiked: (state, { payload }) => {
            state.isLiked = payload;
        },
        resetTrackState: (state) => {
            state.track_id = '';
            state.artwork = '';
            state.name = '';
            state.artists = '';
            state.album = '';
            state.track_url = '';
            state.preview_url = '';
            state.isLiked = false;
            state.isEmpty = true;
        },
    }
});

export const {
    setTrack,
    isTrackLiked,
    resetTrackState
} = trackSlice.actions;