const bankService = require('./bank-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { accountNumber } = require('../../../models/transfers-schema');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { accountNumber, accessCode } = request.body;

  try {
    // Check login credentials
    const loginSuccess = await bankService.checkLoginBank(
      accountNumber,
      accessCode
    );

    if (!loginSuccess) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong access code'
      );
    }

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}
/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createTransfer(request, response, next) {
  try {
    const accountNumber = request.body.accountNumber;
    const accessCode = request.body.accessCode;
    const pin = request.body.pin;

    const success = await bankService.createTransfer(accountNumber, accessCode, pin);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create transfer'
      );
    }

    return response.status(200).json({ accountNumber, accessCode, pin });
  } catch (error) {
    return next(error);
  }
}


async function updateTransferPin(request, response, next) {
  try {
    const pin = request.body.pin;

    const success = await bankService.updateTransferPin(pin);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update transfer pin'
      );
    }

    return response.status(200).json({ });
  } catch (error) {
    return next(error);
  }
}

async function deleteAccount(request, response, next) {
  try {
    const accountNumber = request.body.accountNumber;

    const success = await bankService.deleteAccount(accountNumber);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete account'
      );
    }

    return response.status(200).json({ accountNumber });
  } catch (error) {
    return next(error);
  }
}

async function getTransferHistory(request, response, next) {
  try {
    const history = await bankService.getTransferHistory();
    return response.status(200).json(history);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  createTransfer,
  updateTransferPin,
  deleteAccount,
  getTransferHistory,
};
