import { decode } from 'jsonwebtoken';

/**
 * Retrieves the role from a JWT token.
 *
 * @param {string} token - The JWT token.
 * @return {Promise<string|null>} The role extracted from the token, or null if the token is false.
 */
export const getRole = async (token) => {
  if (token) {
    const decodedToken = decode(token);
    return decodedToken["custom:role"];
  }
};