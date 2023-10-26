/**
 * Maps artist names from an array of objects and returns them as a single string.
 * @function mapArtists
 * @param {Array<Object>} array - The array of objects to extract artist names from.
 * @throws {Error} Throws an error if the parameter is not a valid array.
 * @returns {String} A string containing artist names separated by commas.
 */
export const mapArtists = (array) => {

    if (!Array.isArray(array)) {

        throw new Error ('The parameter "array" must be a valid array.')

    };

    /**
     * An array containing artist names.
     * @type {Array}
     */
    const artists = array.map(artist => artist.name);

    return artists.length === 1 ? artists[0] : artists.join(', ');

};