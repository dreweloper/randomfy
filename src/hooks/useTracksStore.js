// import { useCookies } from 'react-cookie';
// import { useDispatch, useSelector } from 'react-redux';
// import { generateRandomNumber } from '../helpers';
// import { addTrack, setTrackError, startTrackLoading } from '../store/slices';
// import { ACCESS_TOKEN_KEY, MAXIMUM_LIMIT, SPOTIFY_BASE_URL, USER_ID } from '../utils';

// export const useTracksStore = () => {

//     // REACT-REDUX HOOKS
//     const { user } = useSelector(state => state.user);

//     const dispatch = useDispatch();

//     // REACT-COOKIE HOOK
//     const [cookies] = useCookies([ACCESS_TOKEN_KEY]);

//     // VARIABLES
//     const fetchOptions = { headers: { Authorization: `Bearer ${cookies.access_token}` } };

//     // FUNCTIONS
//     const getRandomItem = async (type, total, playlist_id) => {

//         let url, message;

//         if (type === 'playlist') {

//             url = `${SPOTIFY_BASE_URL}/v1/users/${USER_ID}/playlists`;

//             message = "Failed to obtain random user's playlist";

//         } else if (type === 'track') {

//             url = `${SPOTIFY_BASE_URL}/v1/playlists/${playlist_id}/tracks`;

//             message = 'Failed to obtain random track';

//         } else {

//             throw new Error('Invalid type');

//         };

//         try {

//             const randomOffset = generateRandomNumber(total);

//             const queryParams = `limit=1&offset=${randomOffset}`;

//             const response = await fetch(`${url}?${queryParams}`, fetchOptions);

//             if (!response.ok) {

//                 throw new Error(message);

//             } else {

//                 const { items } = await response.json();

//                 return type === 'playlist' ? items[0].id : items[0].track;

//             };

//         } catch (error) {

//             throw error;

//         };

//     };

//     const checkPlaylistOrTrackStatus = async (type, id) => {

//         let url, message;

//         if (type === 'playlist') {

//             url = `${SPOTIFY_BASE_URL}/v1/playlists/${id}/followers/contains?ids=${user.id}`;

//             message = 'Failed to check if user follows the playlist';

//         } else if (type === 'track') {

//             url = `${SPOTIFY_BASE_URL}/v1/me/tracks/contains?ids=${id}`;

//             message = 'Failed to check if user has already saved the track';

//         } else {

//             throw new Error('Invalid type');

//         };

//         try {

//             const response = await fetch(url, fetchOptions);

//             if (!response.ok) {

//                 throw new Error(message);

//             } else {

//                 const [data] = await response.json();

//                 return data;

//             };

//         } catch (error) {

//             throw error;

//         };

//     };

//     /**
//      * Get a list of the playlists owned or followed by a Spotify user.
//      * @async
//      * @function getUserPlaylists
//      * @returns {Object} A paged set of playlists.
//      * @throws {Error} Throws an error if it fails to obtain the user's playlists.
//      */
//     const getUserPlaylists = async () => {

//         /**
//          * Get user's playlists endpoint.
//          * @type {String}
//          */
//         const url = `${SPOTIFY_BASE_URL}/v1/users/${USER_ID}/playlists`;

//         try {

//             /**
//              * The Spotify API response object.
//              * @type {Object}
//              */
//             const response = await fetch(url, fetchOptions);

//             if (!response.ok) {

//                 throw new Error("Failed to obtain user's playlists");

//             } else {

//                 const data = await response.json();

//                 return data;

//             };

//         } catch (error) {

//             throw error;

//         };

//     };

//     /**
//      * Gets full details of the items (tracks) of a playlist owned by a Spotify user.
//      * @async
//      * @function getPlaylistItems
//      * @param {String} id - The Spotify ID of the playlist.
//      * @returns {Object} Pages of tracks.
//      * @throws {Error} Throws an error if it fails to obtain the playlist items.
//      */
//     const getPlaylistItems = async (id) => {

//         /**
//          * Get playlist items endpoint.
//          * @type {String}
//          */
//         const url = `${SPOTIFY_BASE_URL}/v1/playlists/${id}/tracks?limit=${MAXIMUM_LIMIT}`;

//         try {

//             /**
//              * The Spotify API response object.
//              * @type {Object}
//              */
//             const response = await fetch(url, fetchOptions);

//             if (!response.ok) {

//                 throw new Error('Failed to obtain playlist items');

//             } else {

//                 const data = await response.json();

//                 return data;

//             };

//         } catch (error) {

//             throw error;

//         };

//     };

//     //! STEP 1
//     const getRandomPlaylist = async () => {

//         const type = 'playlist';

//         try {

//             const { total } = await getUserPlaylists();

//             const playlist_id = await getRandomItem(type, total);

//             const isFollowed = await checkPlaylistOrTrackStatus(type, playlist_id);

//             return { playlist_id, isFollowed };

//         } catch (error) {

//             throw error;

//         };

//     };

//     //! STEP 2
//     const getRandomTrack = async (playlist_id) => {

//         let track;

//         const type = 'track';

//         try {

//             /**
//              * @type {Object}
//              * @prop {Number} total - The total number of available tracks to return.
//              * @prop {Array} items - An array of playlist track objects.
//              */
//             const { total, items } = await getPlaylistItems(playlist_id);

//             if (total < MAXIMUM_LIMIT) {

//                 const randomIndex = generateRandomNumber(total);

//                 track = items[randomIndex].track;

//             } else {

//                 track = await getRandomItem(type, total, playlist_id);

//             };

//             const isLiked = await checkPlaylistOrTrackStatus(type, track.id);

//             return {
//                 track_id: track.id,
//                 artwork: track.album.images[0].url,
//                 name: track.name,
//                 artist: track.artists[0].name,
//                 preview_url: track.preview_url,
//                 isLiked
//             };

//         } catch (error) {

//             throw error;

//         };

//     };

//     //! FINAL FUNCTION
//     const getRandomTrackFromSpotifyPlaylists = async () => {

//         // const playlist_id = '1tBrrDq0Pl06iG1Fh1Dbs4';

//         try {

//             dispatch(startTrackLoading());

//             const playlist = await getRandomPlaylist();

//             const track = await getRandomTrack(playlist.playlist_id);

//             dispatch(addTrack({ playlist, track }));

//         } catch (error) {

//             console.error(error.message);

//             dispatch(setTrackError());

//         };

//     };


//     return { getRandomTrackFromSpotifyPlaylists };

// };