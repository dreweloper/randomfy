import { MESSAGE } from "../utils";
/**
 * Sets an error message based on the provided HTTP status code.
 *
 * @param {Number} status - The HTTP status code.
 * @returns {String} - The corresponding error message.
 */
export const setErrorMessage = (status) => {

    /**
     * Variable that holds the error message. Initialized with an empty string.
     * @type {String}
     */
    let message = '';

    if (status >= 400 && status < 500) {

        // Client-side errors
        message = status === 401 ? MESSAGE.UNAUTHORIZED : status === 404 ? MESSAGE.NOT_FOUND : MESSAGE.BAD_REQUEST;

    } else if (status >= 500) {

        // Server-side errors
        message = MESSAGE.SERVER_ERROR;

    };

    return message;

};