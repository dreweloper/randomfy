/**
 * Generates a random number within a specified range.
 * @function generateRandomNumber
 * @param {Number} range - The maximum value (inclusive) for the generated random number.
 * @returns {Number} A random number within the specified range.
 * @throws {Error} Throws an error if the provided range is not a number.
 */
export const generateRandomNumber = (range) => {

    if (isNaN(parseInt(range))) {

        throw new Error('The parameter "range" must be a valid number.');

    };

    return Math.floor(Math.random() * range) + 1;

};