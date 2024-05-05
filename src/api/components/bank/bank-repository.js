const { Client } = require('../../../models');

async function getClients() {
  return Client.find({});
}

async function getClient(id) {
  return Client.findById(id);
}

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
