const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

// Define the loginAttempts map to store login attempts for each email
const loginAttempts = new Map();
let authenticationRepository; // Define authenticationRepository globally

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  // Lazy loading of authenticationRepository
  if (!authenticationRepository) {
    authenticationRepository = require('./authentication-repository');
  }

  const user = await authenticationRepository.getUserByEmail(email);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    // Store login time if login is successful
    const loginTime = new Date();
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  }

  return null;
}

/**
 * Check if the user has exceeded the login attempt limit
 * @param {string} email - Email
 * @returns {boolean} True if the user has exceeded the limit, false otherwise
 */
function checkLoginAttemptsExceeded(email) {
  // Get the number of login attempts for the email
  const attempts = loginAttempts.get(email) || 0;

  // Check if the login attempts limit has been reached
  if (attempts >= 5) {
    return true;
  }

  return false;
}

/**
 * Increment the login attempts for the given email
 * @param {string} email - Email
 */
function incrementLoginAttempts(email) {
  // Increment the login attempts for the email
  const attempts = loginAttempts.get(email) || 0;
  loginAttempts.set(email, attempts + 1);
}

/**
 * Reset the login attempts for the given email
 * @param {string} email - Email
 */
function resetLoginAttempts(email) {
  // Reset the login attempts for the email
  loginAttempts.set(email, 0);
}

// Reset the login attempts for all users after 30 minutes
setInterval(() => {
  loginAttempts.clear();
}, 30 * 60 * 1000);

module.exports = {
  checkLoginCredentials,
  checkLoginAttemptsExceeded,
  incrementLoginAttempts,
  resetLoginAttempts
};
