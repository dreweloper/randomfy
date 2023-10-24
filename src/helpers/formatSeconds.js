/**
 * Formats a number of seconds as a string in the "mm:ss" format.
 * @param {Number} time - The number of seconds to format.
 * @returns {String} A string representation of the seconds in "mm:ss" format.
 */
export const formatSeconds = (time) => {

    /**
     * The integer part of the time, obtained by removing any fractional digits.
     * @type {Number}
     */
    const seconds = Math.trunc(time);

    return seconds < 10 ? `00:0${seconds}` : `00:${seconds}`;

};