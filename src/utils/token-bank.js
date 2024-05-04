const jwt = require('jsonwebtoken');

const config = require('../core/config');

/**
 * Sign and generate JWT token
 * @param {string} accessCode - access code
 * @returns {string} Token
 */
function generateTokenBank(accountNumber, accessCode) {
  // Sign the JWT token with user info and set the expiration date
  return jwt.sign(
    {
      accountNumber,
      accessCode
    },
    config.secret.jwt,
    {
      expiresIn: config.secret.jwtExpiresIn,
    }
  );
}

module.exports = {
  generateTokenBank,
};
