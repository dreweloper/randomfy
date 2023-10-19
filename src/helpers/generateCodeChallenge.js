/**
 * Generates a code challenge for OAuth PKCE (Proof Key for Code Exchange) flow.
 * @async
 * @function generateCodeChallenge
 * @param {String} codeVerifier - The code verifier used to generate the code challenge.
 * @returns {String} The generated code challenge.
 */
export const generateCodeChallenge = async (codeVerifier) => {

    /**
     * Encodes a string as Base64 URL-safe format.
     * @function base64encode
     * @param {String} string - The string to be encoded.
     * @returns {String} The Base64 URL-safe encoded string.
     */
    const base64encode = (string) => {

        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

    };

    const encoder = new TextEncoder();

    const data = encoder.encode(codeVerifier);

    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return base64encode(digest);

};