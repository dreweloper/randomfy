/**
 * Request options to be used in the fetch request.
 * @typedef {Object} FetchOptions
 * @prop {String} [method] - The request HTTP method.
 * @prop {Object} [body] - The request body data.
 * @prop {Object} headers - The request headers.
 * @prop {String} [headers.Authorization] - The authorization token, if applicable.
 * @prop {String} [headers.Content-Type] - The content type of the request, if applicable.
 */

/**
 * Makes a request to the Spotify API.
 * @async
 * @function fetchSpotifyData
 * @param {Object} parameters - An object containing request options.
 * @param {String} parameters.url - The URL to send the request to.
 * @param {String} parameters.method - The HTTP method to use (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @param {Object} [parameters.data={}] - Data to send with the request.
 * @param {String} [parameters.token=undefined] - The Spotify access token for authorization.
 * @returns {Promise<Object>|Promise<Response>} A Promise that resolves to the JSON response (for 'GET' and 'POST' requests) or a Response object (for 'PUT' and 'DELETE' requests).
 * @throws {Error} Throws an error if the request fails or if the Spotify API returns an error.
 */
export const fetchSpotifyData = async ({ url, method, data = {}, token = undefined }) => {

    /**
     * @type {FetchOptions}
     */
    let options = {};

    // AUTH
    if (method == 'POST') {

        options = {
            method,
            body: new URLSearchParams(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        };

    };

    // FOLLOW / LIKE
    if (method === 'PUT' || method === 'DELETE') {

        options = {
            method,
            body: JSON.stringify({ ...data }),
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

    };

    if (method === 'GET') {

        options = { headers: { Authorization: `Bearer ${token}` } };

    };

    try {

        /**
         * A Promise that resolves to the Spotify API response.
         * @type {Promise<Object>} 
         */
        const response = await fetch(url, options);

        if (!response.ok) {

            /**
             * A Promise that resolves to the JSON response.
             * @type {Promise<Response>}
             * @prop {Object} error - An object representing an error response.
             * @prop {Number} error.status - The HTTP status code of the error.
             * @prop {String} error.message - A short description of the cause of the error.
             */
            const { error: { status, message } } = await response.json();

            throw new Error(`${status} ${message}`);

        } else {

            // The 'PUT' and 'DELETE' endpoints used by the app do not return JSON.
            return (method === 'PUT' || method === 'DELETE') ? response : await response.json();

        };

    } catch (error) {

        throw error;

    };

};