// COOKIES
export const ACCESS_TOKEN_KEY = 'access_token';
export const CODE_VERIFIER_KEY = 'code_verifier';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const STATE_KEY = 'spotify_auth_state';

// SPOTIFY AUTH
export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
export const CODE_CHALLENGE_METHOD = 'S256';
export const GRANT_TYPE = { ACCESS_TOKEN: 'authorization_code', REFRESH_TOKEN: 'refresh_token' };
export const MAX_AGE = { ACCESS_TOKEN: 3600, REFRESH_TOKEN: 60 * 60 * 24 * 7 };
export const REDIRECT_URI = 'http://localhost:5173/login';
export const RESPONSE_TYPE = 'code';
export const SCOPE = 'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative user-library-read user-library-modify';
export const SPOTIFY_AUTH_BASE_URL = 'https://accounts.spotify.com';

// SPOTIFY API
export const SPOTIFY_API_BASE_URL = 'https://api.spotify.com';
export const USER_ID = 'spotify';

// STATUS STATE
export const STATUS = { IDLE: 'idle', LOADING: 'loading', SUCCEEDED: 'succeeded', FAILED: 'failed' };