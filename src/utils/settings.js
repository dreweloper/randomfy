// STATUS STATE
export const STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed'
};

// AUTH
export const BASE_URL = 'https://spotify-authorization.onrender.com/api';
export const REDIRECT_URI = 'http://localhost:5173/login';
export const SCOPE = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative user-library-read user-library-modify';

// COOKIES
export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const STATE_KEY = 'spotify_auth_state';

// SPOTIFY
export const SPOTIFY_BASE_URL = 'https://api.spotify.com';
export const USER_ID = 'spotify';
export const MAXIMUM_LIMIT = 100;