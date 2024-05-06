const clientsRepository = require('./bank-repository');
const { hashPassword } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getClients() {
  const clients = await clientsRepository.getClients();

  const results = [];
  for (let i = 0; i < clients.length; i += 1) {
    const client = clients[i];
    results.push({
      id: client.id,
      name: client.name,
      email: client.email,
      accountNumber: client.accountNumber,
      accessCode: client.accessCode,
      pin: client.pin,
      balance: client.balance
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getClient(id) {
  const client = await clientsRepository.getClient(id);

  if (!client) {
    return null;
  }

  return {
    id: client.id,
    name: client.name,
    email: client.email,
    accountNumber: client.accountNumber,
    accessCode: client.accessCode,
    pin: client.pin,
    balance: client.balance
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} accessCode - access code
 * @param {number} pin -pin
 * @param {number} balance -balance
 * @returns {boolean}
 */
async function createClient(name, email, accountNumber, accessCode, pin, balance) {
  const stringPin = String(pin)
  
  // Hash access code dan pin
  const hashedAccessCode = await hashPassword(accessCode);
  const hashedPin = await hashPassword(stringPin);

  const success = await clientsRepository.createClient(name, email, accountNumber, hashedAccessCode, hashedPin, balance);
  if(success) {
    return true
  } else {
    return false
  }
} 
/**
 * Update existing user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function updateClient(id) {
  const client = await clientsRepository.getClient(id);

  if (!client) {
    return false; // Mengembalikan false jika klien tidak ditemukan
  }


  const success = await clientsRepository.updateClient(id);
  if(success) {
    return true
  } else {
    return false
  }
    
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteClient(id) {
  const client = await clientsRepository.getClient(id);

  if (!client) {
    return null;
  }

  const success = await clientsRepository.getClient(id);
  if(success) {
    return true
  } else {
    return false
  }
    
}


async function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a unique account number
async function generateUniqueAccountNumber() {
  const min = 1000000000; // Minimum 10-digit number
  const max = 9999999999; // Maximum 10-digit number
  let accountNumber;

  do {
    accountNumber = getRandomNumber(min, max);
    // Check if the account number already exists in the database
    // You need to implement this check using your database querying mechanism
    // For demonstration purposes, we assume there's no duplication
    isUnique = true; // Placeholder condition assuming the number is unique
  } while (!isUnique);

  return accountNumber;
}

module.exports = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  generateUniqueAccountNumber,
};
