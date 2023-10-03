/**
 * Retrieves a random playlist from a Spotify user.
 * @async
 * @function getRandomPlaylist
 * @returns {Object} An object containing playlist information.
 * @throws {Error} Throws an error if any step of the process fails.
 */
const getRandomPlaylist = async () => {

    let response, url, playlist = {};

    try {

        // Get User's Playlists endpoint
        url = `${SPOTIFY_BASE_URL}/v1/users/${USER_ID}/playlists`;

        // 1) Get a list of the playlists owned or followed by a Spotify user
        response = await fetch(url, fetchOptions);

        if (!response.ok) {

            throw new Error("Failed to obtain user's playlists");

        } else {

            /**
             * The total number of items (playlists) available to return.
             * @type {Number}
             */
            const { total } = await response.json();

            /**
             * Calculate a random offset for selecting an item (playlist object).
             * @type {Number}
             */
            const randomOffset = generateRandomNumber(total);

            // Get User's Playlists endpoint with specified limit and offset query params
            url = `${SPOTIFY_BASE_URL}/v1/users/${USER_ID}/playlists?limit=1&offset=${randomOffset}`;

            // 2) Get a random playlist owned or followed by a Spotify user
            response = await fetch(url, fetchOptions);

            if (!response.ok) {

                throw new Error("Failed to obtain random user's playlist");

            } else {

                /**
                 * The Spotify ID for the playlist.
                 * @type {String}
                 */
                const { items: [{ id: playlist_id }] } = await response.json();

                playlist = { playlist_id };

                // Check if Users Follow Playlist endpoint
                url = `${SPOTIFY_BASE_URL}/v1/playlists/${playlist_id}/followers/contains?ids=${user.id}`;

                // 3) Check to see if the Spotify user is following a specified playlist
                response = await fetch(url, fetchOptions);

                if (!response.ok) {

                    throw new Error('Failed to check if user follows the playlist');

                } else {

                    /**
                     * An array with destructured value indicating whether the user follows ('true') or not ('false') the playlist.
                     * @type {Boolean}
                     */
                    const [isFollowed] = await response.json();

                    return playlist = { ...playlist, isFollowed };

                };

            };

        };

    } catch (error) {

        throw error;

    };

};

/**
 * Retrieves a random track from a playlist with the provided ID.
 * @async
 * @function getRandomTrack
 * @param {String} playlist_id - The Spotify ID for the playlist.
 * @returns {Object} An object containing track information.
 * @throws {Error} Throws an error if any step of the process fails.
 */
const getRandomTrack = async (playlist_id) => {

    let url, response, track;

    try {

        // Get Playlist Items endpoint
        url = `${SPOTIFY_BASE_URL}/v1/playlists/${playlist_id}/tracks?limit=${MAXIMUM_LIMIT}`;

        // Get full details of the items (track objects) of a playlist owned by a Spotify user
        response = await fetch(url, fetchOptions);

        if (!response.ok) {

            throw new Error('Failed to obtain playlist items');

        } else {

            /**
             * Response object from the Spotify API.
             * @type {Object}
             * @prop {Number} total - The total number of items (tracks) available to return.
             * @prop {Array} items - An array of playlist track objects.
             */
            const { total, items } = await response.json();

            // Checks if the number of tracks exceeds the maximum limit (100)
            if (total < MAXIMUM_LIMIT) {

                /**
                 * Calculate a random index for selecting an item (track object).
                 * @type {Number}
                 */
                const randomIndex = generateRandomNumber(items.length);

                // A random track object
                track = items[randomIndex].track;

            } else {

                /**
                 * Calculate a random offset for selecting an item (track object).
                 * @type {Number}
                 */
                const randomOffset = generateRandomNumber(total);

                // Get Playlist Items endpoint with different 'limit' and 'offset' query params than the previous one
                url = `${SPOTIFY_BASE_URL}/v1/playlists/${playlist_id}/tracks?limit=1&offset=${randomOffset}`;

                // Get full details of one item (track object) of a playlist owned by a Spotify user
                response = await fetch(url, fetchOptions);

                if (!response.ok) {

                    throw new Error('Failed to obtain random track');

                } else {

                    /**
                     * Response object from the Spotify API.
                     * @type {Object}
                     */
                    const data = await response.json();

                    // A random track object
                    track = data.items[0].track;

                };

            };

            // Check User's Saved Tracks endpoint
            url = `${SPOTIFY_BASE_URL}/v1/me/tracks/contains?ids=${track.id}`;

            // Check if one or more tracks is already saved in the current Spotify user's 'Your Music' library
            response = await fetch(url, fetchOptions);

            if (!response.ok) {

                throw new Error('Failed to check if user has already saved the track');

            } else {

                /**
                 * An array with destructured value indicating whether the user has already added ('true') or not ('false') the track to the 'Your Music' library.
                 * @type {Boolean}
                 */
                const [isLiked] = await response.json();

                return {
                    track_id: track.id,
                    artwork: track.album.images[0].url,
                    name: track.name,
                    artist: track.artists[0].name,
                    preview_url: track.preview_url,
                    isLiked
                };

            };

        };

    } catch (error) {

        throw error;

    };

};