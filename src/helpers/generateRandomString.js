/**
 * Generates a random string containing numbers and letters.
 * @function generateRandomString
 * @param {Number} length - The length of the string.
 * @returns {String} The generated string.
 * @throws {Error} Throws an error if the provided length is not a number.
 */
export const generateRandomString = (length) => {

  if (isNaN(parseInt(length))) {

    throw new Error('The parameter "length" must be a valid number.');

  };

  let text = "";

  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {

    text += possible.charAt(Math.floor(Math.random() * possible.length));

  };

  return text;

};