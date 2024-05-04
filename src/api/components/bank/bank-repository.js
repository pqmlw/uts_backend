const { Transfer } = require('../../../models');

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByAccountNumber(accountNumber) {
  return User.findOne({ accountNumber });
}

module.exports = {
  getUserByAccountNumber,
};

/**
 * Get a list of transfers
 * @returns {Promise<Array>} Array of transfer objects
 */
async function getTransfers() {
  return Transfer.find({});
}

/**
 * Create a new transfer
 * @param {string} sender - Sender's account number
 * @param {string} receiver - Receiver's account number
 * @param {number} amount - Amount to transfer
 * @param {string} description - Transfer description
 * @returns {Promise<Object>} Created transfer object
 */
async function createTransfer(accountNumber, accessCode, pin) {
  return Transfer.create({
    accountNumber,
    accessCode,
    pin,
  });
}

/**
 * Update the description of a transfer
 * @param {string} id - Transfer ID
 * @param {string} description - New description
 * @returns {Promise<boolean>} Indicates if the update was successful
 */
async function updateTransferPin(pin) {
  const result = await Transfer.updateOne({ $set: { pin } });
  return result.nModified === 1;
}

/**
 * Delete the receiver's account associated with a transfer
 * @param {string} accountNumber - Receiver's account number
 * @returns {Promise<boolean>} Indicates if the deletion was successful
 */
async function deleteAccount(accountNumber) {
  const result = await Transfer.deleteOne({ accountNumber });
  return result.deletedCount === 1;
}

/**
 * Get the transfer history
 * @returns {Promise<Array>} Array of transfer objects representing the history
 */
async function getTransferHistory() {
  // Assuming the transfer history is the list of all transfers
  return Transfer.find({});
}

module.exports = {
  getUserByAccountNumber,
  getTransfers,
  createTransfer,
  updateTransferPin,
  deleteAccount,
  getTransferHistory,
};
