const { Client } = require('../../../models');

/**
 * Get users
 * @returns {Promise}
 */
async function getClients() {
  return Client.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getClient(id) {
  return Client.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {number} accountNumber - account number
 * @param {string} accessCode - access code
 * @param {number} pin -pin
 * @param {number} balance -balance
 * @returns {Promise}
 */
async function createClient(name, email, accountNumber, accessCode, pin, balance) {
  return Client.create({
    name,
    email,
    accountNumber,
    accessCode,
    pin,
    balance,
  });
}

/**
 * Update a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function updateClient(id, name, email, balance) {
  return Client.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
        balance,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteClient(id) {
  return Client.deleteOne({ _id: id });
}

module.exports = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
};
