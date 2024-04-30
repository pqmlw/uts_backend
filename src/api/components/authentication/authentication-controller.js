const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check if the user has exceeded the attempt limit
    const loginAttemptsExceeded = authenticationServices.checkLoginAttemptsExceeded(email);
    if (loginAttemptsExceeded) {
      const attempts = 5; // Maximum number of login attempts
      throw errorResponder(
        errorTypes.FORBIDDEN_ERROR,
        `[${new Date().toISOString()}] User ${email} gagal login. Attempt = ${attempts}. Limit reached.`
      );
    }
  
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      // Increment login attempts and record attempt time
      authenticationServices.incrementLoginAttempts(email);
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    return response.status(200).json(loginSuccess);
  } catch (error) {
    // If login attempt fails, log the time of the attempt
    if (error.statusCode === 403 && error.error === 'FORBIDDEN_ERROR') {
      console.log(error.message);
    }
    return next(error);
  }
}

module.exports = {
  login,
};
