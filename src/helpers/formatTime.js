/**
 * Formats a number of seconds as a string in the "mm:ss" format.
 * 
 * Note: this function is designed to work exclusively with seconds because it is used to format the time
 * for a Spotify track preview, which lasts for 30 seconds by default.
 * 
 * @function formatTime
 * @param {Number} time - The number of seconds to format.
 * @returns {String} A string representation of the seconds in "mm:ss" format.
 */
export const formatTime = (time) => {

    /**
     * The integer part of the time, obtained by removing any fractional digits.
     * @type {Number}
     */
    const seconds = Math.trunc(time);

    return seconds < 10 ? `00:0${seconds}` : `00:${seconds}`;

};