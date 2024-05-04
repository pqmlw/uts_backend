const clientsRepository = require('./bank-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

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

async function createClient(name, email, accountNumber, accessCode, pin, balance) {
  const stringPin = String(pin)
  
  const hashedAccessCode = await hashPassword(accessCode);
  const hashedPin = await hashPassword(stringPin)

  try {
    await clientsRepository.createClient(name, email, accountNumber, hashedAccessCode, hashedPin, balance);
  } catch (err) {
    return null;
  }

  return true;
}


async function updateClient(id, name, email, accountNumber) {
  const client = await clientsRepository.getClient(id);

  if (!client) {
    return null;
  }

  try {
    await clientsRepository.updateClient(id, name, email, accountNumber);
  } catch (err) {
    return null;
  }

  return true;
}

async function deleteClient(id) {
  const client = await clientsRepository.getClient(id);

  if (!client) {
    return null;
  }

  try {
    await clientsRepository.deleteClient(id);
  } catch (err) {
    return null;
  }

  return true;
}

async function emailIsRegistered(email) {
  const client = await clientsRepository.getClientByEmail(email);

  return !!client;
}

async function checkPin(id, pin) {
  const client = await clientsRepository.getClient(id);
  
  if (!client) {
    return false;
  }

  return passwordMatched(pin, client.pin);
}

async function changeBalance(id, balance) {
  const client = await clientsRepository.getClient(id);

  if (!client) {
    return false;
  }

  try {
    await clientsRepository.changeBalance(id, balance);
  } catch (err) {
    return false;
  }

  return true;
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
  emailIsRegistered,
  checkPin,
  changeBalance,
  generateUniqueAccountNumber,
};
