const bankRepository = require('./bank-repository');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { generateTokenBank } = require('../../../utils/token-bank');

async function checkLoginBank(accountNumber, accessCode) {
  const transfer = await bankRepository;
  if (accountNumber && accessCode) {
    return {
      token: generateTokenBank(accountNumber, accessCode),
    };
  }
  return null;
}

async function getTransfers(request, response, next) {
  try {
    const transfers = await bankRepository.getTransfers();
    return response.status(200).json(transfers);
  } catch (error) {
    return next(error);
  }
}

async function createTransfer(request, response, next) {
  try {
    const accountNumber = request.body.accountNumber;
    const accessCode = request.body.accessCode;
    const pin = request.body.pin;

    const success = await bankRepository.createTransfer(accountNumber, accessCode, pin);
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

    const success = await bankRepository.updateTransferPin(pin);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update transfer pin'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

async function deleteAccount(request, response, next) {
  try {
    const receiver = request.params.receiver;

    const success = await bankRepository.deleteAccount(receiver);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete receiver account'
      );
    }

    return response.status(200).json({ receiver });
  } catch (error) {
    return next(error);
  }
}

async function getTransferHistory(request, response, next) {
  try {
    const history = await bankRepository.getTransferHistory();
    return response.status(200).json(history);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  checkLoginBank,
  getTransfers,
  createTransfer,
  updateTransferPin,
  deleteAccount,
  getTransferHistory, 
};
